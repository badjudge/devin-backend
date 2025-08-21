import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({
   model: "gemini-2.5-flash" ,
   systemInstruction:'you are an expert in MERN and development . you have an experience of 10 years in the development. you always write code in modular and break the code in the possible way and follow v=best practices , you use understandable comments in the code, you create files as needed, you write code while mailtaining the working of previous code.you always folow the best practices of development . you never miss the edge cases and always write code that is scalable and maintainable, in your code you always handle the errors and exceptions'
  });

export const generateResult = async (prompt) => {
  const result = await model.generateContent(prompt);
  return result.response.text();
};




/*import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI(process.env.GOOGLE_AI_KEY);

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

main();*/