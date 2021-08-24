import env from 'dotenv';
env.config();
import Admins from '../schema/Admins';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Customers from '../schema/Customers';

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const admin = await Admins.findOne({ email });
    if (!admin) {
      console.log('here');
      return res.status(400).json({
        message: 'Invalid Credentials',
        status: false,
      });
    }
    const passMatch = await bcrypt.compare(password, admin.password);
    if (!passMatch) {
      return res.status(400).json({ 
        message: 'Password is not correct', 
        status: false 
      })
        
    }
    const token = jwt.sign(
      {
        email: admin.email,
        id: admin._id,
      },
      process.env.SECRET,
      { expiresIn: '24h' }
    );

    console.log(token);

    res.cookie('@csrf', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, //a day
    });

    return res
      .status(200)
      .json({
        status: true,
        token,
        adminInfo: { email, fullname: admin.fullname },
      })
      .status(200);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: 'An error occurred',
      status: false,
      error: err.message,
    });
  }
};

export const AuthUser = async (req, res) => {
  // console.log('con', req.body.csrf);
  try {
    console.log('verifying...');

    const cookie = req.cookies['@csrf'];
    const confirm = jwt.verify(cookie, process.env.SECRET);
    if (!confirm) {
      return res.status(401).json({
        message: 'Unauthorized',
        status: false,
      });
    }

    const admin = await Admins.findOne({ _id: confirm.id });

    return res.json({
      status: true,
      adminInfo: { email: admin.email, fullname: admin.fullname },
    });
  } catch (err) {
    console.log(err.message);
    res.status(401).json({
      message: 'Unauthorized',
      status: false,
      error: err.message,
    });
  }
};

export const Register = async (req, res) => {
  try {
    const { email, password, fullname } = req.body;
    const admin = await Admins.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 12);
    if (admin) {
      return res.status(400).json({
        message: 'Email account already registered',
        status: false,
      });
    } else {
      await Admins.create({
        email,
        password: hashedPassword,
        fullname,
      });
      return res.status(201).json({
        message: 'Account created successfully',
        status: true,
      });
    }
  } catch (err) {
    console.log('reg error', err);
    res.status(500).json({
      message: 'An error occurred',
      status: false,
      error: err.message,
    });
  }
};

export const LogOut = async (req, res) => {
  try {
    res.cookie('@csrf', '', {
      maxAge: -1,
    });
    res.status(201).json({
      status: true,
      message: 'success',
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: 'An error occurred',
      status: false,
      error: err.message,
    });
  }
};

export const acceptCustomer = async (req, res) => {
  try {
    const { personalId } = req.params;
    // var customer = await Customers.findOne({ regNumber});
    // if(customer.status == 'accepted'){
    //   return res.json({ message: 'This customer has already been accepted', status: false })
    // }
    const data = await Customers.findOneAndUpdate(
      { personalId },
      { status: 'accepted' },
      { new: true }
    );
    console.log(personalId, data);
    return res.status(201).json({ message: 'Customer accpted', status: true });
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred',
      status: false,
      error: err.message,
    });
  }
};

export const rejectCustomer = async (req, res) => {
  try {
    const { personalId } = req.params;
    // var customer = await Customers.findOne({ regNumber});
    // if(customer.status == 'rejected'){
    //   return res.json({ message: 'This customer has already been rejected', status: false })
    // }
    await Customers.findOneAndUpdate(
      { personalId },
      { status: 'rejected' },
      { new: true }
    );
    return res.status(201).json({ message: 'Customer rejected', status: true });
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred',
      status: false,
      error: err.message,
    });
  }
};
