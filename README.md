# ivy

ivy (aka. iv) is a lightweight JS template engine mixing concepts from ReactJS, Angular2 and Incremental DOM.

It is based on two independent pillars: on one hand, a template syntax named [XJS][] that was designed as a refinement of React's [JSX][] and, on the other hand, a state-management library ([trax][]) that allows to track changes in data objects.

[XJS]: https://github.com/AmadeusITGroup/xjs
[JSX]: https://reactjs.org/docs/introducing-jsx.html
[trax]: https://github.com/AmadeusITGroup/trax


ivy introduces many new concepts, such as
- [templates as functions][tf], that can be read as a sequence of JavaScript statements
- [js statements][jss] for loops, conditional blocks, local variables, etc.
- [param nodes][pnd] to support advanced component APIs with multiple named content blocks
- [decorators][] to combine multiple behaviors on a same elements (or components)
- [labels][] to retrieve references to generated HTML elements (or components)
- [CMS content][cms] support - to dynamically interpret template fragments served by a CMS
- [pre-processors][pp] to inject or modify a template content a compilation time

[tf]: http://amadeusITGroup.github.io/ivy/#/examples/hello
[jss]: http://amadeusITGroup.github.io/ivy/#/examples/loops
[pnd]: http://amadeusITGroup.github.io/ivy/#/examples/section
[decorators]: http://amadeusITGroup.github.io/ivy/#/api/decorators
[labels]: http://amadeusITGroup.github.io/ivy/#/examples/labels1
[cms]: http://amadeusITGroup.github.io/ivy/#/examples/fragment1
[pp]: http://amadeusITGroup.github.io/ivy/#/examples/preprocessors

Please visit [ivy documentation page][ivy] for more details and examples

[ivy]: http://amadeusITGroup.github.io/ivy


----
Code and documentation licensed under MIT

Copyright © 2020 Amadeus SAS