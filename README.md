# Simple AEM Front-End structure example
---
This repo contains an example of a very simple, yet slightly opinionated front end structure for use with AEM, or Adobe Experience Manager. You can find a full write-up on this over at [@aesinv: A simplified front end architecture solution for AEM]().

## Front End
Since maven compiles the sass and AEM handles a lot of the script concatenation, getting Gulp setup to work with the project is optional but very useful for extended front end development. Gulp is mainly integrated into the project for ease of development with the front end, providing automagic Sass compilation, JavaScript linting and slinging of updated front end resources (HTML, CSS/SCSS, JS) to AEM.

### Requirements
To install the front end tooling:

- [Node.JS / NPM](https://nodejs.org/en/)

### Set Up
- Install [Gulp](http://gulpjs.com/) globally via `npm install -g gulp`
- In the command line, make your way to the project root and run the `npm install` command

### Front end tasks
- `gulp watch` - Watches for changes to JavaScript, CSS/Sass, and HTML files, runs any necessary subtasks and slings the results to AEM.
- `gulp sass` - Builds all Sass files and slings the compiled stylesheet and source maps to AEM.
- `gulp js:lint` - Runs all JavaScript files against [JSHint](http://jshint.com/) and outputs the results to the console.

### Front end structure
_All directories are relative to the `jcr_root` of `namespace-ui`._

The structure is broken up between global styles/scripts and component-specific styles/scripts. Global styles/scripts are found within the `/etc/designs/` directories whereas component specific styles/scripts are found within the `/apps/namespace/` directories.

Important directories/files:
- **Main SCSS file**: `/etc/designs/namespace/styles/main.scss`
- **Main SCSS directory**: `/etc/designs/namespace/sass/`
- **Components SCSS file**: `/etc/designs/namespace/sass/components.scss`
- **Main JS directory**: `/etc/designs/namespace/js/`
- **Vendor JS directory**: `/etc/designs/namespace/vendor/`
	
Component and template-specific styles and scripts can be located with the components markup within the `/apps/namespace/components` directory. Because the components directory is set as a Sass include path, components and template sass files can be included into the main `components.scss` file with a path relative to the components path, for example:

	@import "content/testcomponent/testcomponent.scss";
	
