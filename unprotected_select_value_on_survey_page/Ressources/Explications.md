# Unprotected select value on survey page

## How we found the page

On the page `http://192.168.56.101/?page=survey`, can be found a survey select form. Here's what a `<select />` element does look like:

```html
<form action="#" method="post">
    <input type="hidden" name="sujet" value="2">
    <select name="valeur" onchange="javascript:this.form.submit();">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
    </select>
</form>
```

When updating the value of the option of a select for a bigger one (e.g. 1000000), and selecting this option, the server sends back a page containing the flag!

## How to exploit the breach

The server seems not to be verifying the possible select value. Then we could either send any kind of data trying to run some code or sql injections.

Overall in this specific case we could just hack the survey score entering a custom value highly decreasing or increasing the survey mark. 

## How to avoid the breach

Submitted values must be validated server-side as they can not be assumed to be valid. 

It's easy to change the value of an option with developers tools in the browser, and requests can also be made from outside the navigator, and their body can then be totally modified.

Never trust user input.

Server-side in our specific case needs to ensure that submitted value is really an integer between 1 and 10 and nothing else.
