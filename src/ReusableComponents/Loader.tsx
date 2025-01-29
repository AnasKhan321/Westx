import { ColorRing } from 'react-loader-spinner'

const Loader = () => {
  return (
    <div className='w-full min-h-[80vh] flex justify-center items-center  bg-black'>

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