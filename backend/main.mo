import Runtime "mo:core/Runtime";
import EmailClient "email/emailClient";
import Array "mo:core/Array";
import Random "mo:core/Random";

actor {
  let quotes : [Text] = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Success is not the key to happiness. Happiness is the key to success. - Albert Schweitzer",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "It always seems impossible until it's done. - Nelson Mandela",
    "The best time to plant a tree was 20 years ago. The second best time is now. - Chinese Proverb",
    "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
    "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
    "Hardships often prepare ordinary people for an extraordinary destiny. - C.S. Lewis",
  ];

  func getRandomIndex(max : Nat) : async Nat {
    let random = Random.crypto();
    let seed = await* random.natRange(0, max);
    if (max <= 1) { return 0 };
    seed % max;
  };

  func getRandomQuoteInternal() : async Text {
    let index = await getRandomIndex(quotes.size());
    quotes[index];
  };

  public shared ({ caller }) func sendRandomQuoteEmail(emailAddress : Text) : async () {
    let quote = await getRandomQuoteInternal();
    let result = await EmailClient.sendServiceEmail(
      "RandomQuoteApp",
      [emailAddress],
      "Your Inspirational Quote",
      quote,
    );
    switch (result) {
      case (#ok) {};
      case (#err(error)) {
        Runtime.trap("Failed to send quote email: " # error);
      };
    };
  };

  public shared ({ caller }) func getRandomQuote() : async Text {
    await getRandomQuoteInternal();
  };
};
