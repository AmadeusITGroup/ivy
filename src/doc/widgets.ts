import { $template } from "../iv";
import { Data } from '../trax';
import { IvContent } from '../iv/types';

export const IVY_GH_REPO = "https://github.com/amadeusITGroup/ivy/tree/master/";

// <*ivyLogo> : the ivy logo
const ivyLogo = $template`(className="ivyLogoDark") => {
    <svg class={className} width="105px" height="44px" viewBox="0 0 105 44">
        <g transform="translate(3,3)" fill="none" fill-rule="nonzero" stroke-linecap="round" stroke-width="7">
            <path d="M12.5,0.5 L0.5,21.5"/>
            <polyline stroke-linejoin="round" points="55.5 0.5 43.2291116 21.5970036 31.1303622 0.5"/>
            <polyline stroke-linejoin="round" points="98.3696378 1 86.1524963 22.0575024 77.9815673 36.5759163 86.1848189 22.0575024 74 1"/>
        </g>
    </svg>
}`;

const triangle = $template`(pos:string = "top") => {
    $let scale = (pos==="top")? -0.8 : 0.8;

    <svg width="38px" height="21px" viewBox="0 0 38 21" class={pos}>
        <g class="triangle" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linejoin="round">
            <g transform="translate(-308, -180)" fill-rule="nonzero">
                <polygon transform={"translate(327, 191) scale(1, "+scale+") translate(-327, -188) "}
                    points="327 181 345 201 309 201" />
            </g>
        </g>
    </svg>
}`;

const RX_TOP = /top/, RX_BOTTOM = /bottom/;

// <*code> : section to host code extracts
const code = $template`($content:IvContent, indicators="top") => {
    <div class={"code "+indicators.replace(";"," ")}>
        $if (indicators.match(RX_TOP)) {
            <*triangle pos="top"/>
        }
        <! @content/>
        $if (indicators.match(RX_BOTTOM)) {
            <*triangle pos="bottom"/>
        }
    </>
}`;

// <*infoBlock> : information block used on the home page
// e.g. <*infoBlock title="easy" bkgColor="#FF7019" proportions="2;1;9;0.5">
const infoBlock = $template`(title="[title]", className="variantA", proportions="2;2;10;1", $content) => {
    $let props = proportions.split(";");
    $if (props.length!==4) {
        $log("[*infoBlock] Invalid proportions value: "+proportions);
    }
    <div class={"infoBlock "+className}>
        $for (let i=0; 4>i; i++) {
            $if (props[i]==="0") {$exec continue;} // don't create div for this case

            <div style={"flex:" + props[i]} class={(i==2)? "content" : ""}>
                $if (i===1) {
                    <div class="title"> {title} </div>
                } else if (i===2) {
                    <! @content/>
                }
            </>
        }
    </>
}`;


@Data class Notion {
    name: string;
    $content: IvContent;
}
// <*notions> : section to highlight specific points covered in an example
const notions = $template`(notionList:Notion[]) => {
    $let len = notionList.length;
    <div class="notions">
        <div class="block">
            <div class="title"> Notion{len!==1? "s": ""} covered in this example </div>
            <ul>
                $for (let notion of notionList) {
                    <li class="notion"> 
                        <span class="name"> {notion.name} </>
                        $if (notion.$content) {
                            : <! @content={notion.$content}/>
                        }
                    </>
                }
            </>
        </>
    </>
}`;

const reloadBtn = $template`() => {
    <svg class="svgDemoBtn" width="17px" height="18px" viewBox="0 0 17 18">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g fill-rule="nonzero">
                <path d="M8,2.75 C3.99593556,2.75 0.75,5.99593556 0.75,10 C0.75,14.0040644 3.99593556,17.25 8,17.25 C12.0040644,17.25 15.25,14.0040644 15.25,10 C15.25,5.99593556 12.0040644,2.75 8,2.75 Z" id="Rectangle" stroke-width="1.5"/>
                <rect fill="#FFFFFF" transform="translate(12.148310, 3.984250) rotate(-54.000000) translate(-12.148310, -3.984250) " x="9.14830963" y="1.98425028" width="6" height="4"/>
                <polygon stroke-linejoin="round" transform="translate(13.609118, 5.913799) rotate(-26.000000) translate(-13.609118, -5.913799) " points="13.6091182 3.91379881 16.1091182 7.91379881 11.1091182 7.91379881"/>
            </>
        </>
    </>
}`;

const openOutsideBtn = $template`() => {
    <svg class="svgDemoBtn" width="20px" height="20px" viewBox="0 0 20 20">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="Open-outside" fill-rule="nonzero">
                <path d="M5.52969938,4.75 C3.18248919,4.75 1.27969938,6.65278981 1.27969938,9 L1.27969938,15 C1.27969938,17.3472102 3.18248919,19.25 5.52969938,19.25 L11.5296994,19.25 C13.8769096,19.25 15.7796994,17.3472102 15.7796994,15 L15.7796994,9 C15.7796994,6.65278981 13.8769096,4.75 11.5296994,4.75 L5.52969938,4.75 Z" stroke-width="1.5"/>
                <g transform="translate(11.135391, 8.656494) rotate(-42.000000) translate(-11.135391, -8.656494) translate(4.135391, 3.656494)">
                    <rect fill="#FFFFFF" x="0.875671632" y="0.627673419" width="13" height="9"/>
                    <g transform="translate(2.412679, 2.833811)" stroke="#0D5598">
                        <polygon fill="#0D5598" stroke-linejoin="round" transform="translate(7.369026, 2.595538) rotate(90.000000) translate(-7.369026, -2.595538) " points="7.36902625 0.595537535 9.86902625 4.59553754 4.86902625 4.59553754"/>
                        <path d="M0.131428293,3.64028132 L7.13142829,1.64028132" id="Line-2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="bevel" transform="translate(3.631428, 2.640281) rotate(12.000000) translate(-3.631428, -2.640281) "/>
                    </g>
                </g>
            </g>
        </g>
    </svg>
}`;

const githubBtn = $template`(className="") => {
    <svg class={className} viewBox="-1 -1 26 26">
        <g class="logo" stroke="none" stroke-width="1" fill-rule="evenodd" fill="none">
            <path stroke-width="2" d="M11.9945425,0.455 C5.54802758,0.455 0.32,5.68231082 0.32,12.130976 C0.32,17.2894782 3.66510621,21.6652813 8.30467606,23.2091765 C8.88883324,23.3166901 9.10171015,22.9561612 9.10171015,22.646522 C9.10171015,22.3698537 9.09167555,21.6351775 9.08594149,20.6611044 C5.83831427,21.3663935 5.15309432,19.0957065 5.15309432,19.0957065 C4.62197717,17.7467693 3.8564804,17.3876739 3.8564804,17.3876739 C2.79639639,16.6637491 3.93675722,16.6780842 3.93675722,16.6780842 C5.10865537,16.7605113 5.72506662,17.8815197 5.72506662,17.8815197 C6.76651495,19.6655285 8.45806212,19.15018 9.12321287,18.8512923 C9.22929295,18.0972636 9.53104776,17.5826319 9.8643399,17.2909117 C7.27182883,16.9963244 4.5460009,15.9942978 4.5460009,11.5202988 C4.5460009,10.2459044 5.00114177,9.20302256 5.74800286,8.38735278 C5.62758763,8.09204878 5.22692032,6.90438198 5.86268402,5.29741216 C5.86268402,5.29741216 6.84249122,4.98347247 9.07303986,6.49439681 C10.0041076,6.23493068 11.0032672,6.10591437 11.995976,6.10089707 C12.9879681,6.10591437 13.986411,6.23493068 14.9189122,6.49439681 C17.1480273,4.98347247 18.126401,5.29741216 18.126401,5.29741216 C18.7635982,6.90438198 18.3629309,8.09204878 18.2432325,8.38735278 C18.9915271,9.20302256 19.4430841,10.2459044 19.4430841,11.5202988 C19.4430841,16.0057659 16.7129557,16.9927406 14.1125603,17.2815938 C14.5311465,17.6421227 14.9045771,18.3545795 14.9045771,19.4440505 C14.9045771,21.0044311 14.8902419,22.2637737 14.8902419,22.646522 C14.8902419,22.9590282 15.1009686,23.3224242 15.6930101,23.2084597 C20.3289961,21.6609808 23.6712353,17.2880446 23.6712353,12.130976 C23.6712353,5.68231082 18.4432077,0.455 11.9945425,0.455"/>
        </>
    </>
}`;

// <*demo> : display an iframe with the demo page
const demo = $template`(src:string, height:number=120, $template) => {
    <div class="demo">
        <h1> 
            <span class="text"> live demo </>
            <span @onclick={=>$template.query("#frame").contentDocument.location.reload()} title="Reload demo">
                <*reloadBtn/>
            </>
            <a href={"./examples/" + src + "/"} target="_blank" title="Open demo in a separate window" [tabIndex]=-1> 
                <*openOutsideBtn/>
            </>
            <a href={IVY_GH_REPO + "src/doc/examples/" + src} target="_blank" title="View code in github" [tabIndex]=-1> 
                <*githubBtn className="svgDemoBtn"/>
            </>
        </>
        <iframe #frame style={"height:"+height+"px"} src={"./examples/" + src + "/"}/>
    </>
}`;

// common widget library
export default {
    ivyLogo,
    githubBtn,
    code,
    infoBlock,
    notions,
    demo
}
