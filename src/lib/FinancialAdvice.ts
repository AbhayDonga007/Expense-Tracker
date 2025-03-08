import { Budget, Expense } from "@/interface";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyB-4PWKuJa5yApXYGGwrU4KOv9U1HpnB_o";

if (!apiKey) {
  throw new Error("Missing Google Gemini API Key. Set GOOGLE_GEMINI_API_KEY in your environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const getFinancialAdvice = async (totalBudget: number, totalSpend: number,budgetList:Budget[],expenseList: Expense[]): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Use correct model name

    const userPrompt = `
    Given the following financial data:
    - Total Budget: ${totalBudget} Rs.
    - Budgets: ${JSON.stringify(budgetList, null, 2)} Rs.
    - Total Spend: ${totalSpend} Rs.
    - Expenses: ${JSON.stringify(expenseList, null, 2)} Rs.

    Provide financial advice in 2-3 sentences. Include tips on budgeting, saving, and managing overspending effectively.
    `;

    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const advice = response.text();

    return advice || "No advice available.";
  } catch (err: any) {
    console.error("Google Gemini API Error:", err);

    if (err.response?.status === 404) {
      return "The requested model is not available. Please check your API key and permissions.";
    }

    return "Failed to retrieve financial advice. Please try again later.";
  }
};

export default getFinancialAdvice;
