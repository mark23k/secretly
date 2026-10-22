/**
 * Detects language suggesting the writer (or someone they know) may be at
 * risk of self-harm or suicide. Runs on foldForMatching() output.
 *
 * Matching content isn't rejected: it's held for review and the writer is
 * shown crisis resources (see config/crisis.ts).
 */
const STRONG =
  /\b(?:kill(?:ing|ed)? my ?self|unalive (?:my ?self|me)|suicid\w*|end(?:ing)? (?:my (?:own )?life|it all)|tak(?:e|ing) my (?:own )?life|self ?harm\w*|(?:cut|cutting|hurt|hurting|harm|harming|burn|burning) my ?self|(?:dont|do not|didnt) want to (?:live|be alive|be here anymore|exist anymore|wake up)|no (?:reason|point) (?:to|in) (?:live|living|going on)|better off (?:dead|without me)|wish i (?:was|were) dead|wish i (?:wasnt|werent|was never|was not) (?:alive|born)|overdos(?:e|ed|ing))\b/;

/** Often hyperbole ("I wanted to die of embarrassment"), so exclude obvious idioms. */
const WEAK = /\b(?:want(?:ed)? to die|wanna die|ready to die|want to disappear forever)\b(?! (?:of|from|laughing|lol|lmao|haha|inside))/;

export function suggestsSelfHarm(folded: string): boolean {
  return STRONG.test(folded) || WEAK.test(folded);
}
