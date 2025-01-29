import { useNavigate } from 'react-router-dom';

const ReuseableTitle = ({title}  : {title : string}) => {


    const navigate = useNavigate();
    const handleClick = ()=>{
            navigate(-1);
    }
  return (
    <> 
    
    
    <div className=" p-4 bg-black/10 border-b border-white   flex gap-x-2 top-0 absolute font-bold z-10   backdrop-blur-xl w-[100%]  md:w-[41.5%] "> <span className="mt-1 cursor-pointer" onClick={handleClick}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
</svg>
</span>  <span className="text-base  md:text-xl"> {title}  </span>  </div>
    </>
  )
}

export default ReuseableTitle