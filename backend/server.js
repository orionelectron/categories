const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
const Category = require('./models/categories.model');
const app = express();

app.use(cors());
app.use(express.json())


mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true
})



app.get('/categories', async (req, res) => {
    let pipeline = [

        {
            $graphLookup: {
                from: "product_categories",
                startWith: "$parent_id",
                connectFromField: "parent_id",
                connectToField: "_id",
                maxDepth: 0,
        
                as: "parents"
            }
        },
        {
            $project: {
                '_id': 1,
                'name': 1,
                'parents._id': 1,
                'parents.name': 1
            }
        },
        {
            $unwind: "$parents"
        },
        {
            $group: {
                _id: "$parents.name",
                
                children: {
                    "$addToSet": "$name"
                },
               cat_id:  {
                    "$first": "$parents._id"
                }
            }
        }
    ];

    try {
        const categories = await Category.aggregate(pipeline)

        res.json(categories);
    }
    catch (error) {
        res.status(404)
        res.send({ error: "Category doesn't exist" })
    }


})

app.post('/categories', async (req, res) => {

    


    try {
        const data = req.body;
        console.log(data);
        const model = new Category(data);

        const result = await model.save();
        res.send({ message: "Category saved!!" })
    }
    catch (error) {
        res.status(400)
        res.send({ error: "Couldn't save data" })
    }
})


app.listen(8000, () => {
    console.log('Server listening in port 8000!');
})

/*

db.product_categories.insertMany([
    {
        _id: 1,
        name: 'Products',
        parent_id: null
    },
    {
        _id: 2,
        name: 'Digital & Electronics',
        parent_id: 1
    },
    {
        _id: 3,
        name: 'Clothing',
        parent_id: 1
    },
    {
        _id: 4,
        name: 'Books',
        parent_id: 1
    },
    {
        _id: 5,
        name: 'Mobile Phone',
        parent_id: 2
    },
    {
        _id: 6,
        name: 'Mobile Phone Accessories',
        parent_id: 5
    },
    {
        _id: 7,
        name: 'Mobile Phone Pouch covers',
        parent_id: 6
    },
    {
        _id: 8,
        name: 'Mobile Phone Power banks',
        parent_id: 6
    }
]);

// Get specific node children
db.product_categories.aggregate([
    {
        $match: {
            _id: 1
        }
    },
    {
        $graphLookup: {
            from: "product_categories",
            startWith: "$_id",
            connectFromField: "_id",
            connectToField: "parent_id",
            as: "children"
        }
    },
    {
        $project: {
            'name': 1,
            'children._id': 1,
            'children.name': 1
        }
    }
])

// Get specific node parents
db.product_categories.aggregate([

    {
        $graphLookup: {
            from: "product_categories",
            startWith: "$parent_id",
            connectFromField: "parent_id",
            connectToField: "_id",
            maxDepth: 0,
            as: "parents"
        }
    },
    {
        $project: {
            'name': 1,
            'parents._id': 1,
            'parents.name': 1
        }
    },
    {
        $unwind: "$parents"
    },
    {
        $group: {
            _id: "$parents.name",
            children: {
                "$addToSet": "$name"
            }
        }
    }
])

*/