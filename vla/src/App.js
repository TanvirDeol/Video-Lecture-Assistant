import './App.css';
import {useEffect,useState,React} from 'react';
import ReactPlayer from "react-player"


function DataDisplay(props){
  console.log(props.data)
  var arr=[];
  var table = [];
  console.log("Works")
    arr=[];
    Object.keys(props.data).forEach(function(key){
      Object.keys(props.data[key]).forEach(function(k){
        arr.push(props.data[key][k])
      });
    });
    console.log(arr)
    table = arr.map((item)=> <tr>
                                <td className='border border-slate-700 text-gray-200 pl-2
                                hover:bg-gray-600 hover:animate-pulse transition-all'>{item[0]}</td> 
                                <td className='border border-slate-700 text-gray-200 pl-2
                                hover:bg-gray-600 hover:animate-pulse transition-all'>{new Date(Number(item[1]) * 1000).toISOString().substr(11, 8)}</td> 
                              </tr>);
  return (
    <div>
      <table className='table-auto border-separate border border-slate-700 mt-10 m-4 text-gray-50 p-2 '>
        <tr><th>Phrases</th> <th>Timeframes</th></tr>
        {table}</table>
    
    </div>
  );
}

function UserInfo(){
  const [link,setLink] = useState("Enter Link...");
  const [finLink,setFinLink] = useState("https://www.youtube.com/watch?v=fx2Z5ZD_Rbo");
  const [keywords,setKeywords] = useState("Enter Keywords...");
  const [res,setRes] = useState("");

  useEffect(() =>{
    if (ReactPlayer.canPlay(link) === true){
      setFinLink(link);
    }else{
      console.log("Failed: " + link);
    }
  },[link]);

  const handleSubmit =(e) =>{
    e.preventDefault()
    const params = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keywords: keywords, link: link})
    }
    fetch('/fetch_res',params).then(res => res.json()).then(data => setRes(data));
  };
  
  return(
    <div className='grid grid-row-2 grid-col-1 justify-center justify-items-center'>
      <form onSubmit={(e)=>handleSubmit(e)} className="grid grid-row-3 grid-col-1 justify-center justify-items-center">
        <input type="text" value={link} onChange ={(e)=>setLink(e.target.value)} 
        className="bg-gray-600 transition-all hover:brightness-125 text-gray-50/75 hover:ring-2 
        hover:ring-gray-100 rounded  p-2 min-w-full "/> <br></br>
        <input type="text" value={keywords} onChange ={(e)=>setKeywords(e.target.value)}
        className="bg-gray-600 transition-all hover:brightness-125 text-gray-50/75 hover:ring-2 
        hover:ring-gray-100 rounded p-2 min-w-full " />
        <input type="submit" className="focus:ring-2 hover:animate-pulse focus:ring-white bg-blue-600 uppercase font-semibold transition-all hover:drop-shadow-lg hover:brightness-125 text-gray-50 
         rounded-lg m-4 p-2 "/>
        <ReactPlayer url={finLink} controls={true} />
      </form>
      <DataDisplay data={res}></DataDisplay>
      
    </div>
  )
}


function App() {
  const [data,setData] = useState("");

  return (
    <div className="bg-gray-900">
      <p className="App-intro">{data}</p>
      <h1 className="text-white text-4xl font-bold hover:animate-pulse text-center mb-2 pt-10">Video Lecture Assistant</h1>
      <h3 className="text-gray-300 text-xl font-semibold hover:animate-pulse text-center mb-4 p-4">Tanvir Deol - Team H UW DSC X CSC Project Program</h3>
      <UserInfo></UserInfo>

    </div>
  );
}

export default App;
