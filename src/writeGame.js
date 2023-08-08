import React, { Component, useState, useEffect } from 'react';
import {Term, Text} from './term.js'
import {FlashcardsGame} from './flashcards'
import {getCards} from './util.js'

export class WriteTerm extends React.Component
{
	constructor(props)
	{
		super(props)
		this.state = {
			term: 0, //0 = hanzi, 1 = pinyin, 2 = first definition
		}
		this.onClick = this.onClick.bind(this)
	}
	onClick(){
		this.setState({term: (this.state.term + 1)%3})
	}
	render()
	{
		let term = this.state.term == 0 ? this.props.term.hanzi : (this.state.term == 1 ? this.props.term.pinyin :this.props.term.translations[0])
		let color = this.props.complete ? "black" : undefined
		return (
			<span className="WriteTerm" onClick={this.onClick} style={{color: color, borderColor: color}}>
				{term}
			</span>)
	}
}

export class WriteGame extends React.Component
{
	constructor(props)
	{
		super(props);
	    this.state = {
	      cards: [], //current set we are studying
	      count: 0,
	      maxCount: props.cardAmount
	    }
	    getCards(props.link,props.startIndex,props.cardAmount).then((cards) => {
	    	this.setState({cards: cards.map((card) => {return {complete: false, card: card}})})
	    })
	    this.checkText = this.checkText.bind(this)
	}
	checkText(event)
	{
		let count = 0
		let newCards = this.state.cards
		for (let c = 0; c < this.state.cards.length; c++) //assume no terms have been found
		{
			if (event.target.value.includes(newCards[c].card.hanzi))
			{
				newCards[c].complete = true;
				count += 1
			}
			else
			{
				newCards[c].complete = false;
			}
		}
		this.setState({count: count,cards: newCards})
	}
	render()
	{
		let list =[]
		for (let i = 0; i < this.state.cards.length; i++)
		{
			list.push(<WriteTerm term={this.state.cards[i].card} complete={this.state.cards[i].complete}/>)
		}
		let done = {color: this.state.count == this.state.maxCount ? 'green' : 'red'}
		return (
			<div className="locked">
				<div>
					Terms Written: <span style={done}> {this.state.count}</span> out of {this.state.maxCount} (<span style={done}>{Math.round(this.state.count/this.state.maxCount*100,2)}</span>)%
				</div>
				<div className="terms">
					{list}
				</div>
				<textarea className = "writeHere" onChange={this.checkText}>
				</textarea>
			</div>
			)
	}
}