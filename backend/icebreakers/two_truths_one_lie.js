export async function GetTwoTruthsOneLie() {
    // In a real application, you would fetch these statements from a database
    // and they would be specific to each user.
    const statements = [
        { text: "I have traveled to more than 10 countries.", isLie: false },
        { text: "I am a certified scuba diver.", isLie: false },
        { text: "I have never eaten a pineapple.", isLie: true },
    ].sort(() => Math.random() - 0.5); // Randomize the order
    return { statements };
}
//# sourceMappingURL=two_truths_one_lie.js.map