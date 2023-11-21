import React from "react";
import { 
    Audio, BallTriangle, Bars, Blocks, Circles, CirclesWithBar, 
    ColorRing, Comment, Discuss, Dna, Grid, FallingLines, FidgetSpinner, 
    Hearts, InfinitySpin, LineWave, MagnifyingGlass, MutatingDots, Oval, ProgressBar, 
    Puff, Radio, RevolvingDot, RotatingSquare, RotatingLines, Rings, TailSpin, ThreeDots, 
    ThreeCircles, Triangle, RotatingTriangles, Watch, Vortex 
} from "react-loader-spinner";

const loadersMap: {
    [x: string]: (props: {[x: string]: any}) => any
} = { 
    Audio: ({...props}) => {
        return <Audio {...props} />

    }, 
    BallTriangle: ({...props}) => {
        return <BallTriangle {...props} />

    }, 
    Bars: ({...props}) => {
        return <Bars {...props} />

    }, 
    Blocks: ({...props}) => {
        return <Blocks {...props} />

    }, 
    Circles: ({...props}) => {
        return <Circles {...props} />

    }, 
    CirclesWithBar: ({...props}) => {
        return <CirclesWithBar {...props} />

    }, 
    ColorRing: ({...props}) => {
        return <ColorRing {...props} />

    }, 
    Comment: ({...props}) => {
        return <Comment {...props} />

    }, 
    Discuss: ({...props}) => {
        return <Discuss {...props} />

    }, 
    Dna: ({...props}) => {
        return <Dna {...props} />

    }, 
    Grid: ({...props}) => {
        return <Grid {...props} />

    }, 
    FallingLines: ({...props}) => {
        return <FallingLines {...props} />

    }, 
    FidgetSpinner: ({...props}) => {
        return <FidgetSpinner {...props} />

    }, 
    Hearts: ({...props}) => {
        return <Hearts {...props} />

    }, 
    InfinitySpin: ({...props}) => {
        return <InfinitySpin {...props} />

    }, 
    LineWave: ({...props}) => {
        return <LineWave {...props} />

    }, 
    MagnifyingGlass: ({...props}) => {
        return <MagnifyingGlass {...props} />

    }, 
    MutatingDots: ({...props}) => {
        return <MutatingDots {...props} />

    }, 
    Oval: ({...props}) => {
        return <Oval {...props} />

    }, 
    ProgressBar: ({...props}) => {
        return <ProgressBar {...props} />

    }, 
    Puff: ({...props}) => {
        return <Puff {...props} />

    }, 
    Radio: ({...props}) => {
        return <Radio {...props} />

    }, 
    RevolvingDot: ({...props}) => {
        return <RevolvingDot {...props} />

    }, 
    RotatingSquare: ({...props}) => {
        return <RotatingSquare {...props} />

    }, 
    RotatingLines: ({...props}) => {
        return <RotatingLines {...props} />

    }, 
    Rings: ({...props}) => {
        return <Rings {...props} />

    }, 
    TailSpin: ({...props}) => {
        return <TailSpin {...props} />

    }, 
    ThreeDots: ({...props}) => {
        return <ThreeDots {...props} />

    }, 
    ThreeCircles: ({...props}) => {
        return <ThreeCircles {...props} />

    }, 
    Triangle: ({...props}) => {
        return <Triangle {...props} />

    }, 
    RotatingTriangles: ({...props}) => {
        return <RotatingTriangles {...props} />

    }, 
    Watch: ({...props}) => {
        return <Watch {...props} />

    }, 
    Vortex: ({...props}) => {
        return <Vortex {...props} />

    } 
}

interface TYPES_PROPS {
    audio: string,
    bars: string,
    ballTrinagle: string,
    circles: string,
    grid: string,
    hearts: string,
    oval: string,
    puff: string,
    rings: string,
    tailSpin: string,
    threeDots: string,
    RotatingLines: string,
    Dna: string
}

interface LoadingProps {
    type?: string,
    [x: string]: any
}
const Loading: {
    type?: string,
    [x:string]: any
} & {
    TYPES: TYPES_PROPS
} & React.FC<LoadingProps> = ({type, ...props}) => {

    return type != undefined? (loadersMap[type]({...props})) : null
}

Loading.TYPES = {
    audio: "Audio",
    bars: "Bars",
    ballTrinagle: "BallTriangle",
    circles: 'Circles',
    grid: "Grid",
    hearts: "Hearts",
    oval: "Oval",
    puff: "Puff",
    rings: 'Rings',
    tailSpin: 'TailSpin',
    threeDots: "ThreeDots",
    RotatingLines: "RotatingLines",
    Dna: "Dna"
}

export default Loading