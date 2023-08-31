// pages/api/execute.js
import OpenAI from 'openai';
import parser from "@babel/parser";
import traverse from "@babel/traverse";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extractParameters(code) {
    try {
      const ast = parser.parse(code, {
        sourceType: "module"
      });
  
      let params = null;
  
      traverse(ast, {
        CallExpression(path) {
          const node = path.node;

          // Check if it's openai.chat.completions.create
          if (
              node.callee.type === "MemberExpression" &&
              node.callee.object.type === "MemberExpression" &&
              node.callee.object.object.name === "openai" &&
              node.callee.object.property.name === "chat" &&
              node.callee.property.name === "completions"
          ) {
            const calleeNode = path.parentPath.node;
            if (calleeNode && calleeNode.callee.property.name === "create") {
              params = {};

              // Extract properties from the argument object
              calleeNode.arguments.forEach(arg => {
                if (arg.type === "ObjectExpression") {
                  arg.properties.forEach(prop => {
                    if (prop.key.type === "Identifier") {
                      const keyName = prop.key.name;

                      // Handle array of objects like "messages"
                      if (prop.value.type === "ArrayExpression") {
                        params[keyName] = prop.value.elements.map(element => {
                          let obj = {};
                          if (element.type === "ObjectExpression") {
                            element.properties.forEach(innerProp => {
                              if (innerProp.key.type === "Identifier") {
                                const innerKeyName = innerProp.key.name;
                                const innerValue = innerProp.value.value;
                                obj[innerKeyName] = innerValue;
                              }
                            });
                          }
                          return obj;
                        });
                      } else {
                        // This handles simple literals like String, Number, etc.
                        const value = prop.value.type === "StringLiteral" ? prop.value.value : prop.value.name;
                        params[keyName] = value;
                      }
                    }
                  });
                }
              });
            }
          }
        }
      });
  
      return params;
    } catch (error) {
      console.error("Error in extractParameters:", error);  // Log the error for debugging
      return null;
    }
}


  export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }
  
    let code = req.body.code;
    const regex = /await openai\.chat\.completions\.create\(\{\s*([\s\S]*?)\s*\}\);/m;
    const match = code.match(regex);
    
    var params = match[1].replace(/\n/g, ''); // removes newlines
        // remove /n from params
        params = params.replace(/\\n/g, '');
        params = params.replace(/\n/g, '');
        // convert params to object

        const formattedStr = `{${params
          .replace(/'/g, '"')                // replace single quotes with double quotes
          .replace(/([a-zA-Z0-9_]+):/g, '"$1":')   // enclose property names in double quotes
          .replace(/,\s*$/, '')}}`;           // remove any trailing commas and enclose in curly braces
        
        console.log(formattedStr)
        let paramsObj;
        try {
            paramsObj = JSON.parse(formattedStr);
            console.log(paramsObj);
        } catch (err) {
            console.error("Failed to parse JSON:", err.message, formattedStr);
        }

        const pars = paramsObj;
  
    try {



      const completion = await openai.chat.completions.create(pars);
  
      res.status(200).json(completion.choices);
    } catch (error) {
      console.error("OpenAI API call error:", error);  // More specific logging
      res.status(500).json({ error: error.message });
    }
  }