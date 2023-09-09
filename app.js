//external import
const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const path= require('path');
const fs = require('fs-extra');
const multer = require('multer');
const tempStorage = multer.diskStorage({});
const upload = multer({ storage:tempStorage });
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const cors = require('cors');


//internal import
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const dbConfig = {
    user: "TECHDB",
    password: '123456',
    connectString: "localhost/orclpdb",
    poolMax: 5,
    poolMin: 2,
    poolIncrement: 3,
    poolTimeout: 300,
    queueRequests: true
}

let connectionPool;
app.use(async (req, res, next) => {
    // console.log('Executing connection pool middleware');
    try {
        if (!req.db) {
            const pool = await oracledb.createPool(dbConfig);
            // console.log("pool created successfully");
            connectionPool = pool;
            req.db = pool;
        }
        next();
    } catch (err) {
        // console.error(err);
        res.send('Database connection error.');
    }
});

app.get('/',async (req,res)=>{
   
    try {
        const connection = await req.db.getConnection();
        const query1 = `SELECT CATEGORY,SUBCATEGORY,BRAND FROM PRODUCTS`;
        const query=`SELECT ID,NAME,BASE_PRICE,DISCOUNT,RATING,CATEGORY,SUBCATEGORY,BRAND,STOCK,I.IMG_URL
        FROM (
            SELECT
                ID,NAME,BASE_PRICE,DISCOUNT,RATING,CATEGORY,SUBCATEGORY,BRAND,STOCK,
                ROW_NUMBER() OVER (PARTITION BY CATEGORY ORDER BY RATING DESC) AS rn
            FROM
                PRODUCTS
        ) RANKED_PRODUCTS JOIN IMAGES I ON RANKED_PRODUCTS.ID = I.PRODUCT_ID
        WHERE
            ((CATEGORY = 'Laptop' AND rn <= 4)
            OR
            (CATEGORY = 'Monitor' AND rn <= 4))
                AND I.IMG_URL LIKE '%img1.jpg%'`;

        const query2 = `WITH RankedProducts AS (
            SELECT *
            FROM products
            ORDER BY discount DESC
        )
        SELECT *
        FROM (
            SELECT P.*, I.*
            FROM RankedProducts P
            JOIN IMAGES I ON P.ID = I.PRODUCT_ID
            WHERE I.IMG_URL LIKE '%img1.jpg%'
        )
        WHERE ROWNUM <= 8`;
        const result = await connection.execute(query);
        const result1 = await connection.execute(query1);
        const result2 = await connection.execute(query2);
        
        
        const reslt={
            result: result.rows,
            result1:result1.rows,
            result2:result2.rows,
        }
        
        
        // console.log('Number of connections in use:', req.db.connectionsInUse);
        // console.log('Number of connections available:', req.db.connectionsOpen);
        connection.release();
        res.json(reslt);
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
    
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const bindParams = {
        email: { val: email, type: oracledb.STRING },
        password: { val: password, type: oracledb.STRING }
    }
    try {
        const connection = await req.db.getConnection();
        const query = `SELECT ID,EMAIL, PASS_WORD,ROLE
                    FROM USERS 
                    WHERE EMAIL = :email AND PASS_WORD = :password`;
        
        const result = await connection.execute(query, bindParams, { autoCommit: true });
        const x = result.rows;
        let result1=[];
        let reslt=[];
        if(x.length>0){
            const y=result.rows[0].ID;
            const bindParams1={
                id:{val:y,type:oracledb.NUMBER}
            }
            const query1 = `SELECT SUM(PRODUCT_COUNT) CARTITEMS
                        FROM CART 
                        WHERE USER_ID=:id`;
            result1 = await connection.execute(query1, bindParams1, { autoCommit: true });
            const q = `SELECT * FROM CART C JOIN PRODUCTS P ON P.ID=C.PRODUCT_ID JOIN IMAGES I ON I.PRODUCT_ID=P.ID WHERE C.USER_ID=:id AND I.IMG_URL LIKE '%img1.jpg'`;
            reslt=await connection.execute(q,bindParams1,{autoCommit:true});
        }

        const rslt = {
            result:result.rows,
            result1:result1.rows,
            reslt:reslt.rows,
        }
       
        connection.release();
        res.send(rslt);
    } catch (err) {
        res.send(err.message);
    }
});
app.post('/product', async (req, res) => {
    const {category} = req.body;
    console.log(category);
    const bindParams = {
        category: { val: category, type: oracledb.STRING },
    }
    try {
        const connection = await req.db.getConnection();
        const query = `SELECT * FROM PRODUCTS WHERE CATEGORY = :category`; 
        const result = await connection.execute(query, bindParams, { autoCommit: true });
        connection.release();
        // console.log(result.rows);
        res.json(result.rows);
    } catch (err) {
        res.send(err.message);
    }
});

app.post('/showdetails', async (req, res) => {
    const {id,userId} = req.body;
    const bindParams1 = {
        idval: { val: id, type: oracledb.STRING},
    }
    const bindParams2 = {
        PId: { val: id, type: oracledb.STRING},
        UserId:{ val: userId, type: oracledb.NUMBER}
    }
    try {
        const connection = await req.db.getConnection();
        const query1 = `SELECT * FROM 
        PRODUCTS P JOIN IMAGES I 
        ON P.ID = I.PRODUCT_ID
        WHERE P.ID = :idval AND I.IMG_URL LIKE '%img1.jpg'`;
        const query2 = `SELECT (U.FIRST_NAME||' '||U.LAST_NAME) AS NAME, R.TEXT
        FROM USERS U JOIN REVIEW R ON U.ID = R.USER_ID
        WHERE R.PRODUCT_ID = :idval`;
        const query3 = `SELECT * FROM 
        PURCHASE_PRODUCT PP JOIN PURCHASE P ON PP.PURCHASE_ID = P.PURCHASE_ID
        WHERE PP.PRODUCT_ID = :PId AND P.BOUGHT_BY = :UserId`;
        
        const result1 = await connection.execute(query1,bindParams1, { autoCommit: true });
        const result2 = await connection.execute(query2,bindParams1, { autoCommit: true });
        const result3 = await connection.execute(query3,bindParams2, { autoCommit: true });
        connection.release();
        const result={
            result1: result1.rows,
            result2:result2.rows,
            result3:result3.rows
        }
        res.json(result);
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
});

app.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, phoneNumber, address } = req.body;
    const role = "customer";
    const bindParams = {
        firstName: { val: firstName, type: oracledb.STRING },
        lastName: { val: lastName, type: oracledb.STRING },
        email: { val: email, type: oracledb.STRING },
        password: { val: password, type: oracledb.STRING },
        phoneNumber: { val: phoneNumber, type: oracledb.STRING },
        address: { val: address, type: oracledb.STRING },
        role: { val: role, type: oracledb.STRING }
    }
    try {
        const connection = await req.db.getConnection();
        const emailCheckQuery = `BEGIN
                                    IF is_email_registered(:email) = 0 THEN
                                        :result := 0;
                                    ELSE
                                        :result := 1;
                                    END IF;
                                END;`;
        const emailCheckBindParams = {
            email: { val: email, type: oracledb.STRING, dir: oracledb.BIND_IN },
            result: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        };
        const emailCheckOptions = { outFormat: oracledb.OUT_FORMAT_OBJECT };
        const emailCheckResult = await connection.execute(emailCheckQuery, emailCheckBindParams, emailCheckOptions);
        if (emailCheckResult.outBinds.result === 1) {
        const query = `INSERT INTO USERS (FIRST_NAME, LAST_NAME, EMAIL, PASS_WORD, PHONE_NUMBER, USER_ADDRESS, ROLE) 
                        VALUES (:firstName, :lastName, :email, :password, :phoneNumber, :address, :role)`;
        await connection.execute(query, bindParams, { autoCommit: true });
        connection.release();
        res.send("Registration successful.");
    }
    else
    {
        connection.release();
        res.send("Email is already registered.");
    } 
}   
catch (error) {
        res.send(error.message);
    }
});

app.post('/searchedproducts', async (req, res) => {
    const { key } = req.body;
    console.log(key);
    try {
        const connection = await req.db.getConnection();
        const query = `SELECT *
        FROM (
            SELECT P.*, I.*
            FROM PRODUCTS P
            JOIN IMAGES I ON P.ID = I.PRODUCT_ID
            WHERE UPPER(P.NAME) LIKE '%' || :keyWord || '%' AND I.IMG_URL LIKE '%img1.jpg')
            ORDER BY
            CASE WHEN SUBSTR(REGEXP_SUBSTR(NAME, '[^ ]+$'), 1) = :keyWord THEN 1 ELSE 2 END,
            NAME        
        `;
        // const query = `SELECT *
        //             FROM PRODUCTS P JOIN IMAGES I ON P.ID = I.PRODUCT_ID
        //             WHERE UPPER(P.CATEGORY) LIKE '%' || :keyWord || '%' OR UPPER(P.SUBCATEGORY) LIKE '%' || :keyWord || '%'
        //             OR UPPER(P.BRAND) LIKE '%' || :keyWord || '%' AND I.IMG_URL LIKE '%img1.jpg'`;
        
        const bindParams = {
            keyWord: { val: key.toUpperCase(), type: oracledb.STRING }
        };

        const result = await connection.execute(query, bindParams, { autoCommit: true });
        connection.release();
        res.json(result.rows);
    } catch (err) {
        res.send(err.message);
    }
});

app.post('/showmenuproducts', async (req, res) => {
    const category = req.body.category;
    const subcategory = req.body.subcategory;
    const brand = req.body.brand;
    
    try {
        const bindParams = {
            Category: { val: category.toUpperCase(), type: oracledb.STRING },
            SubCategory: { val: subcategory.toUpperCase(), type: oracledb.STRING },
            Brand: { val: brand.toUpperCase(), type: oracledb.STRING }
        };
        const bindParams1 = {
            Category: { val: category.toUpperCase(), type: oracledb.STRING },
        };
        const connection = await req.db.getConnection();
        const query = `SELECT *
                    FROM PRODUCTS P JOIN IMAGES I ON P.ID = I.PRODUCT_ID
                    WHERE UPPER(P.CATEGORY) LIKE :Category AND (UPPER(P.SUBCATEGORY) LIKE :SubCategory OR  :SubCategory LIKE 'DEFAULTSUBCATEGORY')
                    AND (UPPER(P.BRAND) LIKE :Brand  OR  :Brand LIKE 'DEFAULTBRAND') AND I.IMG_URL LIKE '%img1.jpg'`;
        
        const query1 = `SELECT DISTINCT(BRAND) FROM PRODUCTS WHERE UPPER(CATEGORY) LIKE :Category`;
        


        const result = await connection.execute(query, bindParams, { autoCommit: true });
        const result1 = await connection.execute(query1, bindParams1, { autoCommit: true });
        const rslt={
            result:result.rows,
            result1:result1.rows,
        }
        connection.release();
        res.json(rslt);
    } catch (err) {
        res.send(err.message);
    }
});
app.post('/showfilteredproducts', async (req, res) => {
    try {
        const {category,selectedSubcategories,subcategory,
        selectedBrands,
        selectedProcessors,
        selectedRams,
        selectedDisplay,
        selectedStorage,
        selectedGraphics,minPrice,maxPrice}=req.body;
        console.log(selectedGraphics);

    const connection = await req.db.getConnection();
    let query = `SELECT *
                FROM PRODUCTS P JOIN IMAGES I ON P.ID = I.PRODUCT_ID
                WHERE UPPER(P.CATEGORY) LIKE '${category.toUpperCase()}'`;

        if (selectedSubcategories.length > 0) {
            const subcategoryPlaceholders = selectedSubcategories.map(subcategory => `'${subcategory.toUpperCase()}'`).join(', ');
            console.log(subcategoryPlaceholders);
            query += `AND UPPER(P.SUBCATEGORY) IN (${subcategoryPlaceholders})`;
        }

        if (selectedBrands.length > 0) {
            const brandPlaceholders = selectedBrands.map(brand => `'${brand.toUpperCase()}'`).join(', ');
            console.log(brandPlaceholders);
            if(selectedSubcategories.length > 0){
            const subcategoryPlaceholders = selectedSubcategories.map(subcategory => `'${subcategory.toUpperCase()}'`).join(', ');
            query += `AND UPPER(P.BRAND) IN (${brandPlaceholders}) AND (UPPER(P.SUBCATEGORY) || '/' || UPPER(P.BRAND) IN(SELECT DISTINCT UPPER(SUBCATEGORY) ||'/'||UPPER(BRAND)
                FROM PRODUCTS
                WHERE UPPER(CATEGORY) LIKE '${category.toUpperCase()}'
                AND UPPER(SUBCATEGORY) IN (${subcategoryPlaceholders}))
                OR UPPER(P.BRAND) NOT IN (SELECT DISTINCT UPPER(BRAND)
                    FROM PRODUCTS
                    WHERE UPPER(CATEGORY) LIKE '${category.toUpperCase()}'
                    AND UPPER(SUBCATEGORY) IN (${subcategoryPlaceholders})
                ))`;
            }
            else if(selectedSubcategories.length === 0)
            {
                query +=`AND UPPER(P.SUBCATEGORY) LIKE '${subcategory.toUpperCase()}' AND UPPER(P.BRAND) IN (${brandPlaceholders})`;
            }
        }
        query += ` AND P.BASE_PRICE BETWEEN ${minPrice} AND ${maxPrice} `;
        
        if(category==='Laptop' || category==='Desktop')
        {   
            if(category==='Laptop')
            {
                if(selectedDisplay.length>0){
                
                    const displayPlaceholders = selectedDisplay.map(b => `${b.toUpperCase()}"`).join('|');
                    console.log(displayPlaceholders);
                    query += `AND REGEXP_LIKE(P.NAME, '${displayPlaceholders}', 'i')`;
                }
            }
            if(selectedRams.length>0){
            
                const ramPlaceholders = selectedRams.map(b => ` ${b.toUpperCase()} RAM`).join('|');
                query += `AND REGEXP_LIKE(P.NAME, '${ramPlaceholders}', 'i')`;
            }
            if(selectedProcessors.length>0){
                
                const processPlaceholders = selectedProcessors.map(b => ` ${b.toUpperCase()} `).join('|');
                
                query += `AND REGEXP_LIKE(P.NAME, '${processPlaceholders}', 'i')`;
            }
            if(selectedStorage.length>0){
            
                const storagePlaceholders = selectedStorage.map(b => ` ${b.toUpperCase()} SSD`).join('|');
                
                query += `AND REGEXP_LIKE(P.NAME, '${storagePlaceholders}', 'i')`;
            }
            if(selectedGraphics.length>0){
                const graphicsPlaceholders = selectedGraphics.map(b => `${b.toUpperCase()}`).join('|');
                console.log(graphicsPlaceholders);
                query += `AND REGEXP_LIKE(P.NAME, '${graphicsPlaceholders}', 'i')`;
            }
        }

        query += ` AND I.IMG_URL LIKE '%img1.jpg'`;
        console.log(query);
        const result = await connection.execute(query);
        
    connection.close();
    
        
    res.json(result.rows);
        
    } catch (err) {
        res.send(err.message);
    }
});

app.post('/cart', async (req, res) => {
    const { u_id,id } = req.body;
    console.log(u_id);
    try {
        const connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(`SELECT USER_ID,PRODUCT_ID,PRODUCT_COUNT FROM CART WHERE PRODUCT_ID = ${id} AND USER_ID=${u_id}`);
    console.log(result.rows.length);
    if (result.rows.length > 0) {
        console.log(result.rows);
        const index = result.rows.findIndex(item => item.PRODUCT_ID === id && item.USER_ID===u_id);
        console.log(index);
        const updatedCount = result.rows[index].PRODUCT_COUNT + 1;
        console.log(updatedCount);
        const bindParams = {
            u_id:{val:u_id,type: oracledb.NUMBER},
            id:{val:id,type: oracledb.NUMBER},
            updatedCount:{val:updatedCount,type: oracledb.NUMBER},
          }
      
      const query = `UPDATE CART SET PRODUCT_COUNT = :updatedCount WHERE PRODUCT_ID = :id AND USER_ID=:u_id `;
      console.log("ghkghj");
      await connection.execute(query,bindParams,{autoCommit:true});
    } else {
      const s = 1;
      const bindParams = {
        u_id:{val:u_id,type: oracledb.NUMBER},
        id:{val:id,type: oracledb.NUMBER},
        s:{val:s,type: oracledb.NUMBER},

      }
      const query = `INSERT INTO CART (USER_ID,PRODUCT_ID,PRODUCT_COUNT) VALUES (:u_id,:id,:s)`;
      await connection.execute(query,bindParams,{autoCommit:true});
    }
    const bindParams = {
        u_id:{val:u_id,type: oracledb.NUMBER},
    }
    const q = `SELECT * FROM CART C JOIN PRODUCTS P ON P.ID=C.PRODUCT_ID JOIN IMAGES I ON P.ID=I.PRODUCT_ID WHERE C.USER_ID=:u_id  AND I.IMG_URL LIKE '%img1.jpg'`;
    const reslt=await connection.execute(q,bindParams,{autoCommit:true});

    res.json(reslt.rows);
    
    } catch (error){
        
        res.json(error);
    }
    });
app.post('/cart1', async (req, res) => {
    const {user,id} = req.body;

    const connection = await oracledb.getConnection(dbConfig);

    try {
        const bindParams1 = {
            u_id:{val:user,type: oracledb.NUMBER},
            id:{val:id,type: oracledb.NUMBER},
        }
        const q1= `DELETE FROM CART WHERE USER_ID=:u_id AND PRODUCT_ID=:id`;
        await connection.execute(q1,bindParams1,{autoCommit:true});
        const bindParams = {
            u_id:{val:user,type: oracledb.NUMBER},
        }
        const q = `SELECT * FROM CART C JOIN PRODUCTS P ON P.ID=C.PRODUCT_ID JOIN IMAGES I ON P.ID=I.PRODUCT_ID WHERE C.USER_ID=:u_id AND I.IMG_URL LIKE '%img1.jpg'`;
        const reslt=await connection.execute(q,bindParams,{autoCommit:true});

        const bindParams2={
            id:{val:user,type:oracledb.NUMBER}
        }
        const query1 = `SELECT SUM(PRODUCT_COUNT) CARTITEMS
                    FROM CART 
                    WHERE USER_ID=:id`;
        const result1 = await connection.execute(query1, bindParams2, { autoCommit: true });

        const r={
            reslt:reslt.rows,
            result1:result1.rows
        }
        res.json(r);
        
    }catch (error){
            
            res.json(error);
        }
    });

    
app.post('/payment', async (req, res) => {
    const { orderedProducts,paymentInfo,address } = req.body;
    
    const connection = await oracledb.getConnection(dbConfig);
    const user = orderedProducts[0].USER_ID;
    
    try {
    
        const bindParams = {
            paymentInfo:{val: paymentInfo,type:oracledb.STRING},
            address:{val:address,type:oracledb.STRING},
            user:{val:user,type:oracledb.NUMBER},
            paymentID: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
        }
        const query = ` DECLARE
                            v_paymentID NUMBER;
                        BEGIN
                            INSERT INTO PURCHASE (PAYMENT_INFO, ADDRESS, BOUGHT_BY)
                            VALUES (:paymentInfo, :address, :user)
                            RETURNING PURCHASE_ID INTO v_paymentID;
                            OPEN :paymentID FOR SELECT v_paymentID AS PURCHASE_ID FROM DUAL;
                        END;`;
        const result=await connection.execute(query, bindParams, { autoCommit: true,bindDefs: {
            paymentID: {
              type: oracledb.CURSOR,
            },
          },});
          const resultSet = result.outBinds.paymentID;
          const row = await resultSet.getRow();
          const paymentid = row.PURCHASE_ID;
        console.log(typeof (paymentid));
        await resultSet.close();
        for(let i=0;i<orderedProducts.length;i++)
        {
            const bindParams2 = {
                paymentID:{val: paymentid,type:oracledb.NUMBER},
                productID:{val: orderedProducts[i].PRODUCT_ID,type:oracledb.NUMBER},
                productCount:{val: orderedProducts[i].PRODUCT_COUNT,type:oracledb.NUMBER},
            }
            
            const query2 = `INSERT INTO PURCHASE_PRODUCT (PURCHASE_ID,PRODUCT_ID,PRODUCT_COUNT) VALUES(:paymentID,:productID,:productCount)`;
            console.log(query2);
            await connection.execute(query2,bindParams2,{autoCommit:true});
        }
        console.log(user);
        const bindParams1 = {
            user1:{val: user,type:oracledb.NUMBER},
        }
        const query1 = `DELETE FROM CART WHERE USER_ID=:user1`;
        console.log(query1);
        await connection.execute(query1,bindParams1,{autoCommit:true});
        console.log(query1);
    } catch (error) {
        res.send(error);
    }
    });

    app.post('/userInfo', async (req, res) => {
        const id = req.body.userId;
        const bindParams = {
            USER_ID: { val: id, type: oracledb.NUMBER},
        }
        try {
            const connection = await req.db.getConnection();
            const query = `SELECT * 
                        FROM USERS 
                        WHERE ID = :USER_ID`;
            const result = await connection.execute(query, bindParams, { autoCommit: true });
            connection.release();
            res.json(result.rows);
        } catch (err) {
            res.send(err.message);
            console.log(err);
        }
    });
    app.post('/updateUserInfo', async (req, res) => {
        const { userId,firstName, lastName, email, password, phoneNumber, address } = req.body;
        const bindParams = {
            userId: { val: userId, type: oracledb.NUMBER },
            firstName: { val: firstName, type: oracledb.STRING },
            lastName: { val: lastName, type: oracledb.STRING },
            email: { val: email, type: oracledb.STRING },
            password: { val: password, type: oracledb.STRING },
            phoneNumber: { val: phoneNumber, type: oracledb.STRING },
            address: { val: address, type: oracledb.STRING }
        }
        
        try {       
            const connection = await req.db.getConnection();
            const query = `UPDATE USERS
                SET FIRST_NAME = :firstName,
                LAST_NAME = :lastName,
                EMAIL = :email,
                PASS_WORD = :password,
                PHONE_NUMBER = :phoneNumber,
                USER_ADDRESS = :address
                WHERE ID = :userId
            `;
            await connection.execute(query, bindParams, { autoCommit: true });
            connection.release();
            res.send("Update successful.");
            console.log("Update successful.");
    }   
    catch (error) {
            res.send(error.message);
        }
    });

    app.post('/updateProduct', async (req, res) => {
        const { productId,name, basePrice, discount, rating, category, subcategory,brand,stock } = req.body;
        const bindParams = {
            PId: parseInt(productId),//{ val: productId, type: oracledb.NUMBER},
            PName:name,// { val: name, type: oracledb.STRING },
            BasePrice:parseInt(basePrice),// { val: basePrice, type: oracledb.NUMBER },
            Discount:parseInt(discount),// { val: discount, type: oracledb.NUMBER },
           // Rating: parseInt(rating),//{ val: rating, type: oracledb.NUMBER },
            Category:category,// { val: category, type: oracledb.STRING },
            SubCategory:subcategory,// { val: subcategory, type: oracledb.STRING },
            Brand: brand,//{ val: brand, type: oracledb.STRING },
            Stock:parseInt(stock)// { val: stock, type: oracledb.NUMBER }
        }
        try {
            const connection = await req.db.getConnection();
            const query = `UPDATE PRODUCTS
                SET NAME = :PName,
                BASE_PRICE = :BasePrice,
                DISCOUNT = :Discount,
                CATEGORY = :Category,
                SUBCATEGORY = :SubCategory,
                BRAND = :Brand,
                STOCK = :Stock
                WHERE ID = :PId
            `;
            await connection.execute(query, bindParams, { autoCommit: true });
            connection.release();
            res.send("Update successful.");
            console.log("Update successful.");
    }   
    catch (error) {
            console.log(error);
            res.send(error.message);
        }
    });
    
    app.post('/addNewProduct', upload.single('image'),async (req, res) => {
        const { name, basePrice, discount, category, subcategory,brand,stock } = req.body;
        let imageFile = req.file;
        console.log(req.file);
        const rating = 0;
        const bindParams = {
            PName:name,
            BasePrice:parseInt(basePrice),
            Discount:parseInt(discount),
            Rating: parseInt(rating),
            Category:category,
            SubCategory:subcategory,
            Brand: brand,
            Stock:parseInt(stock),
            productId: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
        }
        
        try {
            const connection = await req.db.getConnection();
            const query = ` DECLARE
                        v_productId NUMBER;
                        BEGIN
                        INSERT INTO PRODUCTS (NAME, BASE_PRICE, DISCOUNT, RATING, CATEGORY, SUBCATEGORY, BRAND, STOCK)
                        VALUES (:PName, :BasePrice, :Discount, :Rating, :Category, :SubCategory, :Brand, :Stock)
                        RETURNING ID INTO v_productId;
                        OPEN :productId FOR SELECT v_productId AS ID FROM DUAL;
                        END;`;
            
            const result=await connection.execute(query, bindParams,{autoCommit:true,bindDefs: {
                productId: {
                  type: oracledb.CURSOR,
                },
              },});
            const prId = result.outBinds.productId;
            const row = await prId.getRow();
          const productId = row.ID;
            console.log(productId);
            imageFile = productId+'/'+imageFile.originalname;
            console.log(imageFile);
            const bindParams1 = {
                productId:{val:productId,type:oracledb.NUMBER},
                url: {val:imageFile,type:oracledb.STRING},
            }
            
            const query1 = `INSERT INTO IMAGES (PRODUCT_ID, IMG_URL) VALUES (:productId,:url)`;
            await connection.execute(query1, bindParams1,{autoCommit:true});
            connection.release();
            const folderName = productId.toString();
            
            const newFolderPath = path.join(__dirname,'src','image',folderName);
            if (!fs.existsSync(newFolderPath)) {
                fs.mkdirSync(newFolderPath);
            }
            console.log("newF:"+newFolderPath);
            const destinationPath = path.join(newFolderPath, req.file.originalname);
            console.log(destinationPath);
            fs.copyFileSync(req.file.path, destinationPath);
            fs.unlinkSync(req.file.path);
            console.log(req.file);
            res.send(imageFile);
            console.log("Adding successful.");
    }   
    catch (error) {
            console.log(error);
            res.send(error.message);
        }
    });

    app.get('/checkUsers',async (req,res)=>{
        try {
            const connection = await req.db.getConnection();
            const query=`SELECT * FROM USERS`;
            const result = await connection.execute(query);
            connection.release();
            res.json(result.rows);
        } catch (err) {
            res.send(err.message);
        }
        
    });

    app.post('/checkUsers',async (req,res)=>{
        const { userId,userEmail,selectedOperation } = req.body;
        const bindParams = {
            Id:parseInt(userId),
            Operation:selectedOperation
        }
        const bindParams1 = {
            Email:userEmail
        }
        try {
            const connection = await req.db.getConnection();
            let query = '';
            let query1 = '';
            if(selectedOperation==='Ban'){
                query = `
                INSERT INTO BANS
                VALUES(:Email,SYSDATE)
            `;
            query1 = `
            DELETE FROM USERS
            WHERE EMAIL = :Email
        `;
            await connection.execute(query, bindParams1, { autoCommit: true });
            await connection.execute(query1, bindParams1, { autoCommit: true });
            connection.release(); 
            res.send("successful.");
            console.log(" Ban successful.");
            }
            else {
                query = `UPDATE USERS
                SET ROLE= :Operation
                WHERE ID = :Id
            `;
            await connection.execute(query, bindParams, { autoCommit: true });
            connection.release(); 
            res.send("successful.");
            console.log("successful.");
        }   
        
            }
            catch (error) {
                console.log(error);
                res.send(error.message);
            }
            
            
        
    });
 
    app.post('/pendingPurchase',async (req,res)=>{
        try {
            const connection = await req.db.getConnection();
            const query=`
            SELECT DISTINCT P.PURCHASE_ID,U.FIRST_NAME,U.ID,U.ROLE,P.PURCHASE_DATE,P.PAYMENT_INFO,PR.NAME,PU.PRODUCT_COUNT
            FROM PURCHASE P JOIN PURCHASE_PRODUCT PU ON P.PURCHASE_ID=PU.PURCHASE_ID 
            JOIN PRODUCTS PR ON PU.PRODUCT_ID=PR.ID JOIN USERS U ON U.ID=P.BOUGHT_BY
            WHERE P.APPROVAL_DATE IS NULL AND U.ROLE='customer' ORDER BY P.PURCHASE_DATE`;
            const result = await connection.execute(query);
            connection.release();
            res.json(result.rows);
        } catch (err) {
            res.send(err.message);
        }
        
    });

    app.post('/usernotification',async (req,res)=>{
        const {user} =req.body;
        console.log("Afsg");
        console.log(user);
        const bindParams = {
            userId:{val:user,type:oracledb.NUMBER},
        }
        try {
            const connection = await req.db.getConnection();
            const query=`SELECT * FROM USER_NOTIFICATION WHERE USER_ID = :userId ORDER BY RECEIVE_DATE DESC`;
            const result=await connection.execute(query,bindParams,{autoCommit:true});
            
            connection.release();
            res.json(result.rows);
        } catch (err) {
            res.send(err.message);
        }
        
    });

    app.post('/pendingPurchase1',async (req,res)=>{
        const {purchaseId,userId,msg} =req.body;
        console.log(userId);
        const bindParams = {
            purchaseId:{val:purchaseId,type:oracledb.NUMBER},
        }
        try {
            const connection = await req.db.getConnection();
            const query=`UPDATE PURCHASE 
            SET APPROVAL_DATE = SYSDATE WHERE PURCHASE_ID = :purchaseId`
            await connection.execute(query,bindParams,{autoCommit:true});
            const bindParams1 = {
                userId:{val:userId,type:oracledb.NUMBER},
                msg:{val:msg,type:oracledb.STRING}
            } 
            const query1=`INSERT INTO USER_NOTIFICATION (USER_ID,MESSAGE) VALUES(:userId,:msg)`;
            await connection.execute(query1,bindParams1,{autoCommit:true});
            connection.release();
            res.json("Successful");
        } catch (err) {
            res.send(err.message);
        }
        
    });

    app.post('/productReview',async (req,res)=>{
        const { product_id,userId,rating,review } = req.body;
        console.log(product_id+" "+userId+" "+rating+" "+review);
        const bindParams = {
            PId:parseInt(product_id),
            U_Id:parseInt(userId),
            Rating:parseInt(rating),
            Review: review
        }
        try {
            const connection = await req.db.getConnection();
                const query = `
                INSERT INTO REVIEW(PRODUCT_ID,USER_ID,RATING,TEXT)
                VALUES(:PID,:U_Id,:Rating,:Review)
            `;
            await connection.execute(query, bindParams, { autoCommit: true });
            connection.release(); 
            res.send("successful.");
            console.log("successful.");        
            }
            catch (error) {
                console.log(error);
                res.send(error.message);
            }
    });
    app.post('/compare',async (req,res)=>{
        const {product1,product2} = req.body;
        console.log(product1);
        try {
            const bindParams = {
                id1:{val:product1,type:oracledb.NUMBER},
                id2:{val:product2,type:oracledb.NUMBER},
            }
            const connection = await req.db.getConnection();
                const query = `SELECT * FROM SPEC_TABLE WHERE PRODUCT_ID IN (:id1,:id2) 
            `;
            const result=await connection.execute(query, bindParams, { autoCommit: true });
            // const bindParams1 = {
            //     id:{val:product1,type:oracledb.NUMBER},
            // }
            
            //     const query1 = `SELECT * FROM SPEC_TABLE WHERE PRODUCT_ID = :id; 
            // `;
            // const result1=await connection.execute(query1, bindParams1, { autoCommit: true });
            connection.release(); 
            // const rslt={
            //     result:result,
            //     result1:result1,
            // }
            res.send(result.rows);
            }
            catch (error) {
                res.send(error.message);
            }
    });

    

process.on('SIGINT', () => {
    closeConnectionPool();
});

process.on('SIGTERM', () => {
    closeConnectionPool();
});

function closeConnectionPool() {
    if (connectionPool) {
        connectionPool.close().then(() => {
            console.log('Connection pool closed.');
            process.exit(0);
        }).catch(err => {
            console.error('Error closing connection pool:', err);
            process.exit(1); 
        });
    } else {
        process.exit(0);
    }
}


//server
app.listen(3000,()=>{
    console.log(`server is listening on port 3000`);
})
