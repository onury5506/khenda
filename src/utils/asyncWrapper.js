export default function asyncWrapper(f){
    return (req,res,...others)=>{
        f(req,res,...others).catch(()=>{
            res.sendStatus(500)
        })
    }
}