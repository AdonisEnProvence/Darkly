When updating the value of the option of a select for a bigger one (e.g. 1000000), and selecting this option, the page reloads and shows the flag.

Submitted values must be validated server-side as they can not be assumed to be valid. It's easy to change the value of an option with developers tools in the browser, and requests can also be made from outside the navigator, and their body can then be totally modified. Never trust user input.

Server-side there needs to be a check to ensure submitted value is really an integer between 1 and 10.
