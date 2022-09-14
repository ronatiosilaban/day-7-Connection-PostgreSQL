const pool = require("./db")

const findAll = () => {
    return pool.query(`SELECT lower(name) AS name, "number", email FROM public.contacts ORDER BY name ASC; `) 
}

const findOne = (name) =>{
    const lowName = name.toLowerCase()
    return pool.query(`SELECT lower(name) AS name, "number", email
	FROM public.contacts where name = '${lowName}' `)
}

const addData = (datass) => {
    return pool.query(`INSERT INTO contacts VALUES('${datass.name}','${datass.number}','${datass.email}') RETURNING *`)
}

const deleteData = (name) => {
    const lowName = name.toLowerCase()
    return pool.query(`DELETE FROM public.contacts WHERE name = '${lowName}'`)
}

const UpdateData = (oldname, name, number, email)=>{
    const lowName = name.toLowerCase()
    return pool.query(`UPDATE contacts SET name='${lowName}', number='${number}', email='${email}'
	WHERE name = '${oldname}'`)
}

module.exports ={findAll, addData , findOne,deleteData,UpdateData}