import './App.scss';
import { useState, useEffect, ChangeEvent, ChangeEventHandler } from 'react';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

function App() {
  const [data, setData] = useState<any>();
  const [d, setD] = useState<any>();
  const [number, setNumber] = useState<number>(0);
  const [input1, setInput1] = useState<string>('');
  const [input2, setInput2] = useState<string>('');
  const [currency_, setCurrency_] = useState<string>('');
  const [currency2_, setCurrency2_] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [counter1, setCounter1] = useState<number>(0);
  const [counter2, setCounter2] = useState<number>(0);

  async function fetchData(){
    await fetch('https://api.exchangerate.host/latest')
    .then(response => response.json()) 
    .then((data) => setData(data.rates))
  }

   useEffect(()=>{
    fetchData();
   }, [])

   const activate = () => {
    setD(Object.keys(data).map(key => ({currencyName: key, currencyValue: data[key]})));
    setNumber(number+1);
   }

   useEffect(()=>{
    let secondInput = document.getElementById('secondInput')! as HTMLInputElement;
    let currency1 = parseFloat((document.getElementById('currencySelect1')! as HTMLSelectElement).value);
    let currency2 = parseFloat((document.getElementById('currencySelect2')! as HTMLSelectElement).value);
    let result = input1 !== '' ? (Math.round(((currency2 / currency1)*parseFloat(input1)) * 100) / 100).toString() : "";
    secondInput.value=(result);
   }, [input1])

   useEffect(()=>{
    let firstInput = document.getElementById('firstInput')! as HTMLInputElement;
    let currency1 = parseFloat((document.getElementById('currencySelect1')! as HTMLSelectElement).value);
    let currency2 = parseFloat((document.getElementById('currencySelect2')! as HTMLSelectElement).value);
    let result = input2 !== '' ? (Math.round(((currency1 / currency2)*parseFloat(input2)) * 100) / 100).toString() : "";
    firstInput.value=(result);
   }, [input2])

   const changeHandler1 = (e: ChangeEvent<HTMLSelectElement>)=>{
    if(currency_ !== '' && currency2_ !== '' && text !== ''){
      document.getElementById('text')!.style.visibility="visible";
    }
    let currency2 = parseFloat((document.getElementById('currencySelect2')! as HTMLSelectElement).value);
    let result = Math.round((currency2 / 1) * 100)/100;
    setText(result.toString());
    setCurrency_(e.target.options[e.target.selectedIndex].text);
  }

  const changeHandler2 = (e: ChangeEvent<HTMLSelectElement>)=>{
    if(currency_ !== '' && currency2_ !== '' && text !== ''){
      document.getElementById('text')!.style.visibility="visible";
    }
    let currency2 = parseFloat((document.getElementById('currencySelect2')! as HTMLSelectElement).value);
    let result = Math.round((currency2 / 1)*100)/100;
    setText(result.toString());
    setCurrency2_(e.target.options[e.target.selectedIndex].text);
  }

  useEffect(()=>{
    let select = (document.getElementById('currencySelect1')! as HTMLSelectElement)!;
    let select2 = (document.getElementById('currencySelect2')! as HTMLSelectElement)!;
    document.getElementById('activate')!.click();

    if(counter1===0){
      for(var i=0;i<select.options.length;i++){
        if (select.options[i].innerHTML === 'USD') {
          select.selectedIndex = i;
          setCounter1(counter1+1);
          break;
        }
    }
  }
    if(counter2===0){

      for(var i=0;i<select2.options.length;i++){
        if (select2.options[i].innerHTML === 'GBP') {
          select2.selectedIndex = i;
          setCounter2(counter2+1);
          break;
        }
    }
    }

  })

  return (
    <div className="App">
      <button id="activate" onClick={activate}>activate</button>
          <div id="text" className="text">
        <h3>1 {currency_} =</h3>
        <h1>{text} {currency2_}</h1>
        </div>
      <div className="container">

      <input id="firstInput" onChange={(e: ChangeEvent<HTMLInputElement>) => {setInput1(e.target.value);}}></input>
      <select id="currencySelect1" onChange={changeHandler1}>
    {number > 0 && d.map((c: any)=>{
      return <option value={c.currencyValue}>{c.currencyName}</option>
    })}
      </select>
      <CompareArrowsIcon className="arrow" />
      <input id="secondInput" onChange={(e: ChangeEvent<HTMLInputElement>) => {setInput2(e.target.value)}}></input>
      <select id="currencySelect2" onChange={changeHandler2}>
      {number > 0 && d.map((c: any)=>{
      return <option value={c.currencyValue}>{c.currencyName}</option>
    })}
      </select>
      </div>
    </div>
  );
}

export default App;