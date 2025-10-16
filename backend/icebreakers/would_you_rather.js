export async function GetWouldYouRather() {
    // In a real application, you would fetch these questions from a database.
    const questions = [
        { optionA: "be able to fly", optionB: "be able to turn invisible" },
        { optionA: "have more time", optionB: "have more money" },
        { optionA: "live in the city", optionB: "live in the country" },
    ];
    const randomIndex = Math.floor(Math.random() * questions.length);
    return { question: questions[randomIndex] };
}
//# sourceMappingURL=would_you_rather.js.map