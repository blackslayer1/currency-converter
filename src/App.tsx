import './App.scss';
import { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

interface Crypto {
  name: string,
  value: string
}

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
  const [openTerminal, setOpenTerminal] = useState<boolean>(true);
  const [cryptoData, setCryptoData] = useState<any>();
  const [loading, setLoading] = useState<boolean>();

  const writeToTerminal = (t: string) => {
    const terminal = document.getElementById('terminal')! as HTMLTextAreaElement;
    terminal.insertAdjacentHTML('beforeend', "~" + t + "\n");
  }

  async function fetchData(){
    setLoading(true);
    await fetch('https://api.exchangerate.host/latest')
    .then(response => response.json()) 
    .then((data) => {
      setData(data.rates);
      setLoading(false);
    })
    .catch(err => {
      writeToTerminal(err);
   });
  }

  useEffect(()=>{
    if(loading){
      writeToTerminal('fetching data...');
    } else {
      writeToTerminal('loading completed');
    }
  }, [loading])

  async function fetchDataCrypto(){
    await fetch('https://api.coincap.io/v2/assets')
    .then(response => response.json()) 
    .then((data) => setCryptoData(data.data[0].priceUsd))
    .catch(err => {
      writeToTerminal(err);
   });
  }

   useEffect(()=>{
    fetchData();
    fetchDataCrypto();
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

  const showTerminal = (e: MouseEvent) => {
    const arrow = e.target as HTMLDivElement;
    const terminal = document.getElementById('terminal-container')!;
    const commands = Array.from(document.getElementsByClassName('commands'));

    if(openTerminal){
      arrow.style.transform="rotate(-45deg)";
      terminal.style.visibility="visible";
    commands.map((elem)=>{
    (elem as HTMLSpanElement).style.visibility="visible";  
    })
      setOpenTerminal(false);
    } else {
      arrow.style.transform="rotate(135deg)";
      terminal.style.visibility="hidden";
    commands.map((elem)=>{
    (elem as HTMLSpanElement).style.visibility="hidden";  
    })
      setOpenTerminal(true);
    }
  }

  const changeTheme = (background: string, color: string) => {
    const terminal = document.getElementById('terminal')! as HTMLTextAreaElement;
    terminal.style.background=background;
    terminal.style.color=color;
  }

  const switchCurrencies = () => {
    const select1 = (document.getElementById('currencySelect1')! as HTMLSelectElement);
    const select2 = (document.getElementById('currencySelect2')! as HTMLSelectElement);
    const selectedCurrency1 = (document.getElementById('currencySelect1')! as HTMLSelectElement).value;
    const selectedCurrency2 = (document.getElementById('currencySelect2')! as HTMLSelectElement).value;
    select1.value=selectedCurrency2;
    select2.value=selectedCurrency1;
  }

function formatAMPM(date: any) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + " " + ampm;
  return strTime;
}

  const showDate = () => {
var date = new Date();
    writeToTerminal(date.toDateString() + " " + formatAMPM(new Date));
  }

  return (
    <div className="App">
      <button id="activate" onClick={activate}>activate</button>
      <div className="crypto">
        <div className="content">
        <h1>Bitcoin Price: </h1>
        <div id="container">
        <span>{'$' + Math.round(cryptoData * 100) / 100}</span>
        </div>
        </div>
      </div>
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
      <CompareArrowsIcon className="arrow" onClick={switchCurrencies} />
      <input id="secondInput" onChange={(e: ChangeEvent<HTMLInputElement>) => {setInput2(e.target.value)}}></input>
      <select id="currencySelect2" onChange={changeHandler2}>
      {number > 0 && d.map((c: any)=>{
      return <option value={c.currencyValue}>{c.currencyName}</option>
    })}
      </select>
      </div>
      <div className="terminal-container">
        <div style={{marginTop: "20px", marginRight: "30px", marginBottom: '10px'}}>
        <span onClick={showDate} className="commands" style={{cursor: "pointer", marginRight: "40px", visibility: "hidden"}}>Current Date</span>
        <span>Show terminal</span>
      <div className="triangle_down" onClick={showTerminal} onMouseOver={(e: MouseEvent) => {(e.target as HTMLDivElement).style.transform="rotate(-45deg)"}} onMouseLeave={(e: MouseEvent) => {
       if(openTerminal){
        (e.target as HTMLDivElement).style.transform="rotate(135deg)"
       }
        }}></div>
          <span onClick={()=>{(document.getElementById('terminal')! as HTMLTextAreaElement).innerHTML=''}} className="commands" style={{cursor: "pointer", marginLeft: "40px", visibility: "hidden"}}>Clear</span>
        </div>
      <div className="terminal-container2" id="terminal-container">
      <textarea className="terminal" id="terminal" readOnly></textarea>
      <div className="themes">
        <div className="hack" onClick={()=>{changeTheme('black', 'limegreen')}}></div>
        <div className="default" onClick={()=>{changeTheme('rgb(34, 34, 34)', 'white')}}></div>
        <div className="white" onClick={()=>{changeTheme('white', 'black')}}></div>
      </div>
      </div>
      </div>
      
    </div>
  );
}

export default App;