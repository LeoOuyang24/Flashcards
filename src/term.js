import React, { Component, useState, useEffect } from 'react';

export function Text(props){ //text bubble, used to show a term or a definition
	return (
	<div className = "term" style={{backgroundColor: props.color ? props.color : "white"}}>
		{props.text}
	</div>)

}

export class Term extends React.Component {
	constructor(props)
	{
		super(props)
	}
	render()
	{
		let texts = (this.props.term ?  //if the term exists...
					(this.props.showTerm ?  //if we are supposed to show it...
						<Text text = {this.props.term.front}/> : //show the term
						this.props.term.back.reduce((accum,value) => (accum.length < 6 ? //...otherwise show the first 6 definitions
							accum.concat([<Text text = {value}/>]) : 
							accum),
							[<Text text = {this.props.term.highlight} color = "yellow"/>])) : //highlight the pinyin and attach it as the top most text bubble
					"UNKNOWN") //term couldn't be found for some reason
	return (
			<div>
				{texts}
			</div>
		)
	}
}