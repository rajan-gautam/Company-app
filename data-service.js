
/*
Rajan Gautam 
Assignment 5
data_service.js */ 
     

const Sequelize = require('sequelize');

var sequelize = new Sequelize('d5fvlsen45hj8f', 'cixamksfnrsrmt', 
'aed8c466e4abaa9ae16acd0e9ca7c7434e87d9c1a99c26cb8d5cc0cc5e0affcd', { host: 'ec2-54-225-110-156.compute-1.amazonaws.com',
dialect: 'postgres', port: 5432, dialectOptions: {
ssl: true
}
});

var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING
});

var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
})



// This function will read the contents of the "./data/employees.json" file
module.exports.initialize = function() {

    return new Promise(function (resolve, reject) {
        sequelize.sync().then(function() {
            resolve("success!");
        }).catch(function(error){
            reject("unable to sync the database");
        })
});
  
}


module.exports.getAllEmployees = function() {

    return new Promise(function (resolve, reject) {
        Employee.findAll()
        .then(function(data){
            resolve(data);
        })
        .catch(function(error){
            reject("no results returned");
        })

});
}



/* module.exports.getManager = function() {

    return new Promise(function (resolve, reject) {
        reject();
});
/*
    return new Promise(function(resolve, reject){

        for (var i = 0; i < employees.length; i++) {
            if (employees[i].isManager == true) {
                managers.push(employees[i]);
            }
        }
        if (managers.length == 0) {
            reject("no results returned");
        } else {
            resolve(managers);
        }
    })
*/
/*
} */

module.exports.getDepartments = function() {

    return new Promise(function (resolve, reject) {
        Department.findAll()
        .then(function(data){
            resolve(data);
        })
        .catch(function(error){
            reject("no results returned");
        })
});

}

module.exports.addEmployee = function (employeeData){
    
    return new Promise((resolve, reject) => {

        employeeData.isManager = (employeeData.isManager) ? true : false;

        Object.keys(employeeData).forEach((key) => {
            if(employeeData[key] == "")
            employeeData[key] = null;
        });

        sequelize.sync()
            .then(() => Employee.create(employeeData)
                .then(() =>{

                    resolve();
                })
                .catch((err) => 
                {
                    reject("unable to create employee");
                })
            );
    });
}

module.exports.addDepartment = function (departmentData) {
    return new Promise((resolve, reject) => 
    {
        Object.keys(departmentData).forEach(key => {
            if(departmentData[key] == "")
                departmentData[key] = null;
        });
        
        sequelize.sync()
            .then(() => Department.create(departmentData)
                .then(() => resolve())
                .catch(err => reject("unable to create department"))
            );
    });
}

module.exports.getEmployeesByStatus = function(stts) {

    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                status: stts
            }
        })
        .then(function(data){
            resolve(data);
        })
        .catch(function(error){
            reject("no results returned");
        })

});
}

module.exports.getEmployeesByDepartment = function(dept) {

    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                department: dept
            }
        })
        .then(function(data){
            resolve(data);
        })
        .catch(function(error){
            reject("no results returned");
        })
});

}

module.exports.getEmployeesByManager = function(mng) {

    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where:{
                employeeManagerNum: mng
            }
        })
        .then(function(data){
            resolve(data);
        })
        .catch(function(data){
            reject("no results returned");
        })
});

}

module.exports.getEmployeeByNum = function(num) {

    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where:{
                employeeNum: num
            }
        })
        .then(function(data){
            resolve(data[0]);
        })
        .catch(function(error){
            reject("no results returned");
        })
});

}


module.exports.updateEmployee = function(employeeData) {
    employeeData.isManager = (employeeData.isManager) ? true : false;

    for (var i in employeeData) {
        if (employeeData.i == "") {
            employeeData.i = null;
        }
    }
    return new Promise(function (resolve, reject) {
        Employee.update({
            employeeNum: employeeData.employeeNum,
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addressCity: employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            maritalStatus: employeeData.maritalStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
        },{
            where:{
                employeeNum: employeeData.employeeNum
            }
        })
        .then(function(data){
            resolve("success");
        })
        .catch(function(data){
            reject("unable to update employee");
        })
});

}

// module.exports.updateDepartment = function(departmentData) {

//     for (var i in departmentData) {
//         if (departmentData.i == "") {
//             departmentData.i = null;
//         }
//     }
//     return new Promise(function(resolve, reject) {
//         Department.update({
//             departmentId: departmentData.departmentId,
//             departmentName: departmentData.departmentName
//         }, {
//             where: {
//                 departmentId: departmentData.departmentId
//             }
//         })
//         .then(function(data) {
//             resolve("Success!");
//         })
//         .catch(function(data) {
//             reject("unable to update department");
//         })
//     });

// }

module.exports.updateDepartment = function (departmentData) {

    return new Promise((resolve, reject) => 
    {
        Object.keys(departmentData).forEach(key => {
            if(departmentData[key] == "")
                departmentData[key] = null;
        });
        sequelize.sync()
            .then(() => Department.update(Object.assign({}, departmentData), {
                where: 
                {
                    departmentId: departmentData.departmentId
                }
            })
                .then(() => resolve())
                .catch((err) => {
                    reject("unable to update department");
                })
            );
    });
}

module.exports.getDepartmentById = function(id) {
    
    return new Promise(function(resolve, reject) {
        Department.findAll({
            where: {
                departmentId: id
            }
        })
        .then(function(data) {
            resolve(data[0]);
        })
        .catch(function(error) {
            reject("no results returned");
        })
    });

}

module.exports.deleteDepartmentById = id => {

    return new Promise((resolve, reject) => {
        Department.destroy({
            where: 
            {
            departmentId: id
            }
        }).then(data => resolve(data))
        .catch(err => reject(err)); 
    })
}

module.exports.deleteEmployeeByNum = function(empNum) {

    return new Promise(function(resolve, reject) {
        Employee.destroy({
            where: {
                employeeNum: empNum
            }
        })
        .then(function() {
            resolve("destroyed!");
        })
        .catch(function(error){
            reject("Unable to delete employee");
        })
    });

}
