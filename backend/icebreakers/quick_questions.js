export async function GetQuickQuestion() {
    // In a real application, you would fetch these questions from a database.
    const questions = [
        { question: "What's your favorite book?" },
        { question: "What's the best concert you've ever been to?" },
        { question: "What's your go-to karaoke song?" },
    ];
    const randomIndex = Math.floor(Math.random() * questions.length);
    return { question: questions[randomIndex] };
}
//# sourceMappingURL=quick_questions.js.map