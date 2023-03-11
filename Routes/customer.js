const express = require("express")
const customerRoutes = express.Router();
const fs = require('fs');

const dataPath = './Details/customer.json'

// util functions 
const saveCustomerData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataPath, stringifyData)
}

const getCustomerData = () => {
    const jsonData = fs.readFileSync(dataPath)
    return JSON.parse(jsonData)
}

const checkCustomerExist = (uniqId) => {
    let customersList = getCustomerData()
    let existCustomer = customersList.find(el => {
        return el.id == uniqId
    })

    if (existCustomer == undefined) {
        return false
    } else {
        return true
    }
}


// add customer
customerRoutes.post('/customer/add', (req, res) => {
    try {
        let customersList = getCustomerData()
        const id = (Math.random() + 1).toString(36).substring(2);

        let payload = req.body.data
        payload.id = id
        customersList.push(payload)
        saveCustomerData(customersList);
        res.send({ success: true, msg: 'customer data added successfully' })
    } catch (error) {
        res.send({ success: false, msg: `Error has occur`, error: error })
    }
})

// get - retrieve all customer list
customerRoutes.get('/customer/list', (req, res) => {
    try {
        const customersList = getCustomerData()
        let arr = []
        customersList.forEach(el => {
            let objData = {
                id: el.id,
                fullname: el.personalData.fullname,
                identificationNo: el.personalData.identificationNo,
                gender: el.personalData.gender
            }

            arr.push(objData)
        });

        res.send({ success: true, msg: 'customer list retrieve successfully', data: arr })
    } catch (error) {
        res.send({ success: false, msg: `Error has occur`, error: error })
    }
})

// get - retrieve specifc customer detail
customerRoutes.get('/customer/detail', (req, res) => {
    try {
        let customersList = getCustomerData()
        const uniqId = req.query.id;

        let isCustExit = checkCustomerExist(uniqId)
        if (!isCustExit) {
            res.send({ success: false, msg: `customer does not exist` })
            return
        }

        let existCustomer = customersList.find(el => {
            return el.id == uniqId
        })

        res.send({ success: true, msg: 'customer detail retrieve successfully', data: existCustomer })
    } catch (error) {
        res.send({ success: false, msg: `Error has occur`, error: error })
    }
});

// put - retrieve specifc customer detail
customerRoutes.put('/customer/edit', (req, res) => {
    try {
        let customersList = getCustomerData()

        const requestBody = req.body.data
        const uniqId = requestBody.id;

        let isCustExit = checkCustomerExist(uniqId)
        if (!isCustExit) {
            res.send({ success: false, msg: `customer does not exist` })
            return
        }

        let existCustomer = customersList.find(el => {
            return el.id == uniqId
        })

        let notSelectedCustomer = customersList.filter(el => {
            return el.id != uniqId
        })

        if (requestBody.personalData !== undefined) {
            for (const key in requestBody.personalData) {
                existCustomer.personalData[key] = requestBody.personalData[key]
            }
        }

        if (requestBody.maritalData !== undefined) {
            for (const key in requestBody.maritalData) {
                existCustomer.maritalData[key] = requestBody.maritalData[key]
            }
        }

        if (requestBody.emergencyContact !== undefined) {
            for (const key in requestBody.emergencyContact) {
                existCustomer.emergencyContact[key] = requestBody.emergencyContact[key]
            }
        }

        let arr = []
        if (notSelectedCustomer.length > 0) {
            arr.push(notSelectedCustomer)
        }

        arr.push(existCustomer)

        saveCustomerData(arr);
        res.send({ success: true, msg: `customer ${existCustomer.personalData.identificationNo} updated successfully` })
    } catch (error) {
        res.send({ success: false, msg: `Error has occur`, error: error })
    }


});

// post - delete specifc customer
customerRoutes.post('/customer/delete', (req, res) => {
    try {
        const bodyData = req.body.data
        const uniqId = bodyData.id;
        console.log('uniqId', uniqId);

        if (uniqId != undefined) {
            let isCustExit = checkCustomerExist(uniqId)
            if (!isCustExit) {
                res.send({ success: false, msg: `customer does not exist` })
                return
            }

            let customersList = getCustomerData()
            let existCustomers = customersList.filter(el => {
                return el.id != uniqId
            })

            saveCustomerData(existCustomers);
            res.send({ success: true, msg: `Customer with id ${bodyData.personalData.identificationNo} has been deleted` })
        } else {
            res.send({ success: false, msg: `Customer with id ${bodyData.personalData.identificationNo} not found` })
        }
    } catch (error) {
        res.send({ success: false, msg: `Error has occur`, error: error })
    }

})
module.exports = customerRoutes