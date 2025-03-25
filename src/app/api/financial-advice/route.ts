import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const api = new OpenAI({
  baseURL: 'https://api.aimlapi.com/v1',
  apiKey: 'dc8d9358a4674f708559b05b09f4b1b1',
});

export async function POST(req: NextRequest) {
  const { totalBudget, totalSpend, budgetList, expenseList } = await req.json();

  try {
    const userPrompt = `
      Given the following financial data:
      - Total Budget: ${totalBudget} Rs.
      - Budgets: ${JSON.stringify(budgetList, null, 2)} Rs.
      - Total Spend: ${totalSpend} Rs.
      - Expenses: ${JSON.stringify(expenseList, null, 2)} Rs.

      Provide financial advice in 2-3 sentences on budgeting, saving, and managing overspending.
    `;

    const result = await api.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a financial assistant who gives smart budgeting and saving advice.',
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    return NextResponse.json({ advice: result.choices[0].message.content });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error generating advice.' }, { status: 500 });
  }
}
