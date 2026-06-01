const express = require('express');




const roleMiddleware = (...requiredRoles) => {


    return (req, res, next) => {
   
        if(!requiredRoles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        next();

    }
    
};

module.exports = roleMiddleware;
