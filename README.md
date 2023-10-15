create-react-widget
-------------------

A small utility to bootstrap micro-frontend projects in React and Typescript. If you are looking for a way of embedding your React application in another website as a widget, this is the tool for you.


## Usage

To create a basic widget project, run the following command:
```bash
npm create react-widget my-widget
```

Then install the dependencies with your favourite package manager. E.g with `npm`:
```bash
cd my-widget
npm install
```

Finally, you can start developing:
```bash
npm run dev
```

When you are happy with you widget, you can build it with:
```bash
npm run build
#or `npm run build:serve` to check how the production version work
```

## License
[MIT](LICENSE) © Javier Marquez