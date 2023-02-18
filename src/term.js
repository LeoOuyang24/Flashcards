import React, { Component, useState, useEffect } from 'react';

export function Text(props){
	return (
	<div className = "term" style={{backgroundColor: props.color ? props.color : "white"}}>
		{props.text}
	</div>)

}

export function Term(props){
	let texts = (props.term ?  (props.showTerm ? <Text text = {props.term.hanzi}/> : 
				props.term.translations.reduce((accum,value) => (accum.length < 6 ? accum.concat([<Text text = {value}/>]) : accum),[<Text text = {props.term.pinyin} color = "yellow"/>])) : "UNKNOWN")
	return (
			<div>
				{texts}
			</div>
		)
}