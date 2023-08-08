import './App.css';
import {read} from './read.js'
import React, { Component, useState, useEffect } from 'react';
import {Term, Text} from './term.js'
import {getCards} from './util.js'


function shuffle(array) { //shamelessly stolen from https://stackoverflow.com/a/2450976/6947131
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export class FlashcardsGame extends React.Component {

  constructor(props)
  {
    super(props);
    this.state = {
      studyTerms: [], //current set we are studying
      curTerm: 0,
      showTerm: true, //show the term vs the definition
      incorrect: []
    }
    let link ="https://raw.githubusercontent.com/clem109/hsk-vocabulary/master/hsk-vocab-json/";
    for (let hsk  of this.props.levels)
    {
     getCards(link + "hsk-level-" + hsk + ".json",this.props.startIndex,this.props.cardAmount)
    .then( (cards) => {
      if (props.charOnly) //parse each individual term
      {
        let newCards = new Map()
        cards.forEach((hanzi) => {
          for (let i = 0; i < hanzi.hanzi.length; i++)
          {
            let char = hanzi.hanzi[i]
            if (!newCards.has(char)) //if we have not yet encountered this character
            {
              newCards.set(char, {
                pinyin: new Set(), //possible pronounciations
                examples:[], //terms that use this character. We want to make sure we have one example for each unique pronounciation
                nextIndex: 0 //the smallest index in "examples" that does not contain a unique pronounciation
                } //create a new set of definitions
                )
            }
            //console.log(newCards[char])
            let obj = newCards.get(char)
            let newPronoun = hanzi.pinyin.split(" ")[i] //new pronounciation
            if (!obj.pinyin.has(newPronoun)) //if it's a new pronounciation...
            {
              obj.pinyin.add(newPronoun) //add the corresponding pronounciation
              obj.examples[obj.nextIndex]=hanzi.hanzi + "( " + hanzi.pinyin + " ): " + hanzi.translations[0] //make sure we add it as an example
              obj.nextIndex += 1 //increase the index so we know where to add the next unique example
            }
            else if (obj.examples.length < 4)
            {
              obj.examples.push(hanzi.hanzi + "( " + hanzi.pinyin + " ): " + hanzi.translations[0]) //not a new pronounciation, but add it as an example if we don't have enough
            }
          }
        })
        cards = []
        newCards.forEach((value,key) => {
          let pinyin = ""
          value.pinyin.forEach((pin) => pinyin += pin + ", ")
          cards.push({
            front: key,
            highlight: pinyin.slice(0,-2),
            back: value.examples
          })

        })

      }
      else //if not characters only, parse the terms normally
      {
         cards = cards.map((hanzi) => {
            return {front: hanzi.hanzi, 
                    highlight: hanzi.pinyin,
                    back: hanzi.translations}
                  })
      }
    this.setState((state,props) => {
        if (this.props.shuffle)
        {
          return {studyTerms: shuffle(state.studyTerms.concat(cards))}
        }
        else
        {
          return {studyTerms: state.studyTerms.concat(cards)}
        }
      })
    }).catch((err) => console.log(err))

    }
      if (props.shuffle)
      {
        this.setState((state,props) => {studyTerms: shuffle(state.studyTerms)})
      }
    this.switchToIncorrect = this.switchToIncorrect.bind(this)
  }

  changeTerm(positive)
  {
    this.setState({showTerm: true})
    if (!positive)
    {
      if (this.state.studyTerms[this.state.curTerm-1] == this.state.incorrect[this.state.incorrect.length - 1]) //when we go backwards we pop incorrect terms off
      {
        this.state.incorrect.pop()
      }
    }
    this.setState((state,props) => ({curTerm: Math.min(this.state.studyTerms.length,Math.max(0,this.state.curTerm + 2*(positive) - 1))}))
  }
  switchToIncorrect() //swap between all cards to incorrect cards
  {
      if (this.state.incorrect.length > 0)
      {
        this.setState({studyTerms: this.props.shuffle ? shuffle(this.state.incorrect) : this.state.incorrect, //swap to incorrect terms, shuffling if needed
                      incorrect: [],
                       showTerm: true,
                      curTerm: 0})
      }
      else
      {
        alert("No incorrect terms!")
      }
  }
  render()
  {
    let terms = this.state.studyTerms
    if (!terms || !terms.length || terms.length <= 0 )
    {
      return (<div>
        FAILED TO LOAD SET
      </div>)
    }
    else
    {
      let display = null
      if (this.state.curTerm >= terms.length) //we are done!
      {
        display = (<div>
                    <Text text = {"Score: " + parseInt((1 - this.state.incorrect.length/this.state.studyTerms.length)*10000/100) + "%"}/>
                    <Text text = {"Total incorrect: " + this.state.incorrect.length + "/" + this.state.studyTerms.length}/>
                  </div>)
      }
      else //not done, show the current term
      {
        display = <Term term={this.state.studyTerms[this.state.curTerm]} showTerm={this.state.showTerm}/>
      }
      return (
        <div>
            <div className="counter">
              {this.state.curTerm + 1}/{terms.length}
              <div className="incorrect">
                Wrong: {this.state.incorrect.length} ({parseInt(( this.state.incorrect.length/terms.length)*10000/100)}%) {/*amount wrong, percentage is rounded*/}
              </div>
            </div>
            <div className = "defs">
              {display}
            </div>
            <div className = "buttons">
              <button onClick = {() => this.setState({showTerm: !this.state.showTerm})}>
                {this.state.showTerm ? " Term" : " Definition"}
              </button>
              <button style={{backgroundColor:"green"}} onClick={() => this.changeTerm(true)}>
                !
              </button>
              <button style={{backgroundColor:"red"}} onClick={() => {if (this.state.curTerm < this.state.studyTerms.length) this.state.incorrect.push(terms[this.state.curTerm]);this.changeTerm(true)}}>
                ?
              </button>
              <button onClick={() => {this.changeTerm(false)}}>
                ⏎
              </button>
              <button onClick={this.switchToIncorrect}>
                Study Incorrect Terms
              </button>
            </div>
        </div>
      );
    }
  }
}