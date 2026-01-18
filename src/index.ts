/**
 * Test function to demonstrate the package functionality
 * @param name - The name to greet
 * @returns A greeting message
 */
export function greet(name: string): string {
  return `Hello, ${name}! Welcome to Mocra.`;
}

/**
 * Example test function that can be run directly
 */
export function test(): void {
  console.log(greet("World"));
  console.log("✅ Mocra package is working correctly!");
}

// Run test if this file is executed directly
if (require.main === module) {
  test();
}

