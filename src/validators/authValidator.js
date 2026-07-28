const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

const isStrongPassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
}

exports.signupValidator = (req, res, next) => {
    let { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if(name.trim() === '' || email.trim() === '' || password.trim() === '' || role.trim() === '') {
        return res.status(400).json({ message: 'Fields cannot be empty' });
    }

    if(!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if(!isStrongPassword(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character' });
    }

    role = role.toLowerCase();
    if(role !== 'recruiter' && role !== 'candidate') {
        return res.status(400).json({ message: 'Role must be either recruiter or candidate' });
    }
 
    req.body.role = role;
    next();
}

exports.loginValidator = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    if(email.trim() === '' || password.trim() === '') {
        return res.status(400).json({ message: 'Email and password cannot be empty' });
    }

    if(!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    next();
}