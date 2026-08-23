import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeUserGenres(userBooks) {
  console.log(`[${new Date().toISOString()}] 🧠 Gemini STARTED: Genre Analysis for ${userBooks.length} books`);
  console.time('🤖 Gemini Genre Analysis');
  try {
    const bookSummaries = userBooks.map(
      book => `"${book.book_title}" by ${book.author} (subjects: ${book.subjects || 'Unknown'}, rating: ${book.book_rating}/5)`
    ).join('\n');
// intentianally shoretened this prompt as larger prompt along with using gemini 2.5 was taking about 10
// secs to answer which is not ideal
// on testing using short queries and using gemini flash lite 2.0  (this is fastest for simple task) time reduced to
// 3 4 second 
    const prompt = `
Analyze this user's reading history and extract their favorite genres. 
Based on the books, their subjects, and ratings, identify the top 3 genres this user prefers.

Books read:
${bookSummaries}
Genre1, Genre2, Genre3
Give output in above format only:
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: prompt,
    });

    console.timeEnd('🤖 Gemini Genre Analysis');
    console.log(response.text.trim())
    return response.text.trim(); 
  } catch (error) {
    console.timeEnd('🤖 Gemini Genre Analysis');
    console.error(`[${new Date().toISOString()}] ❌ Gemini FAILED: Genre Analysis -`, error.message);
    // console.error('Error analyzing user genres:', error);
    return 'Fiction, Non-Fiction, General';
  }
}

export async function generateBookRecommendations(favoriteGenres, userBooks) {
  console.log(`📚 Gemini STARTED: Book Recommendations for genres: "${favoriteGenres}"`);
  console.time('🔮 Gemini Recommendations');

  try {
    const readBookTitles = userBooks.map(book => `"${book.book_title}"`).join(', ');
    
    const prompt = `Recommend 2 books for ${favoriteGenres} reader. Avoid: ${readBookTitles}
JSON format: [{"title":"","author":"","genre":"","reason":"Short reason"}]`;


    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: prompt,
    });

    const rawResponse = response.text.trim();
    const jsonMatch = rawResponse.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      console.timeEnd('🔮 Gemini Recommendations');
      console.log(`✅ Gemini ENDED: Recommendations`);
      return JSON.parse(jsonMatch[0]);
    }

    console.timeEnd('🔮 Gemini Recommendations');
    console.log(`⚠️ Gemini ENDED: Recommendations - No valid JSON found`);
    return [];

  } catch (error) {
    console.timeEnd('🔮 Gemini Recommendations');
    console.error(`❌ Gemini FAILED: Recommendations -`, error.message);
    return [];
  }
}

// i did not use gemini flash lite here as i want gemini to give actual answer where as flash lite will 
// guve superficial answer not a good comprehensive answer  
export async function answerBookQuestion(question, context) {
  console.log(`❓ Gemini STARTED: Q&A for "${context.title}" - Question: "${question}"`);
    console.time('💬 Gemini Q&A');


  try {
    const prompt = `
You are an intelligent reading assistant with comprehensive knowledge of books and literature. You help users by combining their personal reading experience with general literary knowledge.

📚 BOOK INFORMATION:
Title: "${context.title}" by ${context.author}
User's Rating: ${context.rating}/5 stars

📝 USER'S PERSONAL NOTES:
${context.notes || "No personal notes available for this book."}

❓ USER'S QUESTION: ${question}

📋 RESPONSE GUIDELINES:
1. **Use Your Full Knowledge**: Draw from your comprehensive knowledge about this book, its author, themes, literary significance, etc.
2. **Incorporate User Context**: When relevant, reference the user's personal notes and their rating/experience
3. **Provide Rich Answers**: Give detailed, informative responses that go beyond just the provided data
4. **Be Comcise in 3 4 lines**: For questions about authors, themes, historical context, etc., use your full literary knowledge
5. **Connect Personal & General**: Show how the user's experience relates to the broader understanding of the book

EXAMPLES OF GOOD RESPONSES:
- Author questions: Provide full biographical info, other works, writing style, plus how it relates to user's notes
- Theme questions: Explain literary themes comprehensively, then connect to user's specific observations
- Character questions: Full character analysis plus user's personal insights

Please provide a comprehensive, knowledgeable answer that enriches the user's understanding:
`;


    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    console.timeEnd('💬 Gemini Q&A');
    console.log(` ✅ Gemini ENDED`);
    return response.text.trim();
  } catch (error) {
    console.timeEnd('💬 Gemini Q&A');
    console.error(`❌ Gemini FAILED: Q&A for "${context.title}" -`, error.message);
    return 'I apologize, but I cannot answer that question at the moment.';
  }
}
