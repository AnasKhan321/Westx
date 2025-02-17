import { ColorRing } from 'react-loader-spinner'

const SmallLoader = () => {
  return (
    <div className=''>
      <ColorRing
                        visible={true}
                        height="30"
                        width="30"
                        ariaLabel="color-ring-loading"
                        wrapperStyle={{}}
                        wrapperClass="color-ring-wrapper"
                        colors={["#9915eb"  ,  "#9915eb" , "#9915eb" , "#9915eb" , "#9915eb"]}
                      />
    </div>
  )
}

export default SmallLoader
