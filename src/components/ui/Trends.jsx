"use client";
import styles from "./Trends.module.css"
export default function Trends(){
    const trends=[
        {hashtag:"#valdesaone", count : 1},
        {hashtag:"#vulgaire", count: 2},
        {hashtag:"#fun", count:1}
    ];
    const handleClick = (event)=>{
        console.log(`hashtag : ${event.target.textContent} clicked`);
    };
    return (
        <div>
            { trends.map( (trend, index)=>(
                <div key={index} >
                <p className={`font-text txt-small txt-primary-color text-bold ${styles.hashtag}`} onClick={handleClick}>{trend.hashtag}</p>
                <p className="font-text txt-small txt-greyed-color">{trend.count} Tweet{trend.count>1?"s":""}</p>
                </div> ))}
        </div>
    );
}
