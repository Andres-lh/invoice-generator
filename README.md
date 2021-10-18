#Invoice Generator

Web application that generates a receipt according to the added products, to which a discount can be applied through a promotional code.

### Technologies used
- Vanilla JavaScript.
- Sass
- Webpack.
- Babel
- Firebase


Look at this project live: https://kind-bhabha-33021e.netlify.app

### Getting started

Follow these simple steps to run the project locally:

1. Clone the repository
`git clone https://github.com/Andres-lh/invoice-generator.git`

2. Run the following command in the root directory to install all the dependencies of package.json:
`npm install`

3. Start the project:
`npm run dev`

###FlowChart

```flow
st=>start: App Starts
op=>operation: Login operation
cond=>condition: Successful Yes or No?
e=>end: To admin

st->op->cond
cond(yes)->e
cond(no)->op
```
