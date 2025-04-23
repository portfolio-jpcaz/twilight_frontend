// authentication sezrvices that invoke thebackend authentication routes 
export async function signup(data) {
    const signupURL=`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`;
    try {
        const res= await fetch(signupURL,{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        } );
        return res.json();
    } catch (err) {
        const response = { result:false, message: err.message};
        return response;
    }
    
}