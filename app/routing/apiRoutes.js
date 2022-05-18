require("dotenv").config();
const Clarifai = require('clarifai');
const allergens = require('../data/allergens');

const CLARIFAI_FOOD_MODEL = "bd367be194cf45149e75f01d59f77ba7";
const CLARIFAI_API_KEY = process.env.key;


// init Clarifai API
const cApp = new Clarifai.App({
    apiKey: CLARIFAI_API_KEY
});

console.log(allergens);


module.exports = function (app) {
    // POST to the api
    app.post('/api', function (req, res) {
        if (req.body) {
            let img = req.body.url;
            let userAllergies = JSON.parse(req.body.userAllergies);
            // passes the Cloudinary stored image URL to the Clarifai API and returns the components array (object)
            cApp.models.predict(CLARIFAI_FOOD_MODEL, img).then(
                function (response) {
                    let result = {};

                    let allConcepts = response.outputs[0].data;
                    // // result.data = temp;
                    // result.allergensFound = analyzeFood(allConcepts, userAllergies);
                    result.allergensFound = {
                        ress : "img giving result"
                    }
                    // let result = response.outputs[0].data;
                    res.json(result);
                },
                function (err) {
                    console.error(err);
                }
            );
        }
        else
        {
            console.log("12312312")
        }
    });
};

function analyzeFood (allConcepts, userAllergies) {

    let allergensFound = [];

    for (let allergy of userAllergies) { // iterates over the user allergies
        for (let allergen of allergens) { // iterates over the allergens data
            if (allergen.name == allergy) {
                for (let concept of allConcepts) { // iterate over the returned concepts (Clarafai API)
                    for (let i of allergen.data) {
                        if (i == concept) {
                            allergensFound.push(i);
                            // console.log("allergen found: " + i);
                        }
                    }
                }
            }
        }
    }

    return allergensFound;

}