import { ColorRing } from 'react-loader-spinner'

const Loader = () => {
  return (
    <div className='w-full min-h-[96vh] my-[2vh]  max-h-[96vh]  bg-primaryColor md:bg-secondaryColor flex justify-center items-center  md:rounded-lg '>

        <ColorRing
          visible={true}
          height="70"
          width="70"
          ariaLabel="color-ring-loading"
          wrapperStyle={{}}
          wrapperClass="color-ring-wrapper"
          colors={["#9915eb"  ,  "#9915eb" , "#9915eb" , "#9915eb" , "#9915eb"]}
        />
    </div>
  )
}

export default Loader