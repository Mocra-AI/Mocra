"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.greet = greet;
exports.test = test;
/**
 * Test function to demonstrate the package functionality
 * @param name - The name to greet
 * @returns A greeting message
 */
function greet(name) {
    return `Hello, ${name}! Welcome to Mocra.`;
}
/**
 * Example test function that can be run directly
 */
function test() {
    console.log(greet("World"));
    console.log("✅ Mocra package is working correctly!");
}
// Run test if this file is executed directly
if (require.main === module) {
    test();
}
//# sourceMappingURL=index.js.map