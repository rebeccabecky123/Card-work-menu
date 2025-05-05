import { useEffect } from "react"
import data from "src\data.json"


const Product = () => {

    useEffect(()=>{

        const getItem =async()=>{
            try{
                const response = await fetch ("src\data.json")
            }
        }

    },[])










  return (
    <div>



    </div>
  )
}

export default Product