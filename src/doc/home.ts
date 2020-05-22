import { $template } from '../iv';
import w from "./widgets";

const description = $template`(topic:string, $content) => {
    <div class="colA">
        <div class="topic">
            <strong> {topic} </>
        </>
        <div class="detail" @content/>
    </>
}`;

export default $template`() => {
    <div class="home layout">
        <div class="row start">
            <div class="colA">!s</>
            <div class="colB">!s</>
        </>
        <div class="row main">
            <div class="colA">
                <div class="headline">
                    <div>
                        <span class="highlight"> ivy is a typescript library to build </span><br/>
                        <span class="highlight"> advanced web interfaces </>
                    </>
                    <p class="details">
                        ivy is a template engine that tries to combine the best ideas that have 
                        emerged from the major UI frameworks since 2010.
                     </>
                    <p class="details">
                        It is based on <strong>two independent pillars</>: on one hand, a <strong>template syntax </>
                        named <a href="#/api/xjs">XJS</> that 
                        was designed as a refinement of React's JSX, and on the other 
                        hand a <strong>state management library</> (<a href="#/api/trax">trax</>) that allows 
                        to track changes in data objects.
                    </>
                </>
            </>
            <div class="colB">
                <div class="features">
                    <p class="flexible"> flexible </>
                    <p class="reactive"> reactive </>
                    <p class="ts"> typescript-based </>
                    <p class="light"> light-weight </>
                    <p class="efficient"> efficient </>
                    <p class="simple"> simple ! </>
                </>
            </>
        </>
        <div class="row sample">
            <*description topic="templates as functions">
                <p>
                    ivy considers templates as objects associated to a render 
                    function that are defined in a tagged template string that 
                    will be transformed into <strong> typescript instructions at 
                    compilation time </> 
                </p> 
                <p>
                    ivy's mental model is to read the template syntax as a 
                    <strong> sequence of JavaScript statements </> that can 
                    be easily mixed with other statements and that 
                    allow to implement efficient 
                    <a href="http://google.github.io/incremental-dom/"> incremental 
                    dom-like</> algorithm.
                    (<a href="#/examples/hello">more</>)
                </>
            </>
            <div class="colB">
                <div @@extract="intro-samples.ts#hello"/>
            </>
        </>
        <div class="row sample">
            <*description topic="sub-templates">
                <p>
                    with ivy calling sub-templates or re-factoring code into 
                    sub- parametric templates has never been so easy. All that is 
                    needed is to have the template identifier accessible in the template 
                    function JS scope and call the sub-template through a custom element 
                    with the <strong> * prefix </> (ivy defines multiple special elements 
                    this is why a prefix was chosen over a naming convention like for JSX)
                </>
                <p>
                    note: as the template identifier is a local variable, it can also 
                    be <strong> passed as template argument </> and 
                    <strong> can be changed dynamically! </>.
                </>
            </>
            <div class="colB">
                <div @@extract="intro-samples.ts#greetings"/>
            </>
        </>
        <div class="row sample">
            <*description topic="JS statements">
                <p>
                    as all template elements are transformed into JS statements
                    (cf. <a href="#/examples/hello"> mental model </>), it is very easy 
                    to mix ivy statements with normal JS statements.
                </>
                <p> 
                    note: to keep the syntax simple. ivy only exposes a few 
                    <a href="#/examples/loops"> statements </>
                    that need to be <strong> prefixed with the !$ symbol </> so that 
                    they are not mistaken for normal text content.
                </>
            </>
            <div class="colB">
                <div @@extract="intro-samples.ts#jsStatements"/>
            </>
        </>
        <div class="row sample">
            <*description topic="param nodes">
                <p>
                    a component system is not complete until it is possible 
                    to <strong> rebuild all the components exposed by the host system </>
                    (in our case the HTML DOM). This is why ivy introduces 
                    <a href="#/examples/section"> param nodes </> 
                    that can be seen as HTML slots on steroids as they allow to support 
                    content nodes and attributes and sub-param nodes.
                </>
                <p>
                    note: ivy also ensures that content nodes or sub-templates are not
                    loaded / called if not needed (i.e. if they are not projected by 
                    their host template - more 
                    <a href="#/examples/tabs"> here </> 
                    ).
                </>
            </>
            <div class="colB">
                <div @@extract="intro-samples.ts#tabs"/>
            </>
        </>
        <div class="row sample">
            <*description topic="decorators">
                <p>
                    components are very powerful tools to combine parametric blocks 
                    to generate HTML content. However, they come short to help combine 
                    multiple behaviors or non-graphical logic. This why ivy introduces 
                    <a href="#/api/decorators"> decorators </>
                    (also sometimes called <strong> directives </>) to solve this kind 
                    of problems.
                </>
                <p>
                    in ivy, decorators can have 0 to n parameters and can be either 
                    <strong>built-in</>
                    (i.e. interpreted by the ivy compiler) or <strong>custom</> 
                    (i.e. implemented as a runtime JavaScript extension that need 
                    to be imported in the template JS scope).
                </>
            </>
            <div class="colB">
                <div @@extract="intro-samples.ts#decorators"/>
            </>
        </>
        <div class="row sample">
            <*description topic="labels">
                <p>
                    when the HTML DOM is rendered, there are often cases where 
                    we need to <strong> get a references to some of the generated elements </>
                    in order to perform dynamic operations (like setting the focus on 
                    an element). This is where
                    <a href="#/examples/labels1"> ivy labels </> come into play as they 
                    propose a very simple and powerful mechanism to query generated content.
                </>
            </>
            <div class="colB">
                <div @@extract="intro-samples.ts#labels"/>
            </>
        </>
        <div class="row sample">
            <*description topic="CMS content">
                <p>
                    large applications often require to serve dynamic content retrieved 
                    from a CMS. In this case, the ideal solution is to be able to 
                    <strong> combine html content with custom template components </> 
                    and load this content dynamically.
                </>
                <p>
                    with templates compiled into JS code at build time, this requirement is 
                    very hard
                    to support in a simple manner. This is why ivy supports a 
                    <strong> second kind of templates </> called 
                    <a href="#/examples/fragment1"> $fragments </>. These templates are 
                    interpreted dynamically at execution time and can thus be served 
                    by a Content Management System.
                </>
            </>
            <div class="colB">
                <div @@extract="intro-samples.ts#fragments"/>
            </>
        </>
        <div class="row sample">
            <*description topic="pre-processors">
                <p>
                    last but not least, ivy also supports the possibility to 
                    run <strong> pre-processors</>. These 
                    pre-processors are special kind of decorators (with the 
                    double @ prefix) that are called by the XJS parser and that can 
                    modify the XJS parsing result (aka. AST) at compilation time.
                </>
                <p>
                    a very common use case for pre-processors is to inject content 
                    from another file 
                    (cf. <a href="https://github.com/AmadeusITGroup/xjs/blob/master/docs/pre-processors.md#extract">@@extract</>)
                    or highlight code samples 
                    (cf. <a href="https://github.com/AmadeusITGroup/xjs/blob/master/docs/pre-processors.md#ts-typescript-highlighter">@@ts</>)
                    or convert markdown text to HTML
                    (cf. <a href="https://github.com/AmadeusITGroup/xjs/blob/master/docs/pre-processors.md#md-markdown-converter">@@md</>)
                </>
            </>
            <div class="colB">
                <div @@extract="intro-samples.ts#preprocessors"/>
            </>
        </>
        <div class="row bottom">
            <div class="colA">
                <div class="legal">
                    <p> Code and documentation licensed under MIT </>
                    <p> Copyright © 2020 Amadeus SAS </>
                </>
            </>
            <div class="colB">!s</>
        </>
    </>
}`;
