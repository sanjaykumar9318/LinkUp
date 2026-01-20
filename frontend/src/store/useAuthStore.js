import {create} from "zustand"
import axiosInstance from "../lib/axios"
import toast from "react-hot-toast"


const useAuthStore = create((set)=>({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    checkAuth: async () => {
    try {
    const res = await axiosInstance.get("/auth/check");
    set({ authUser: res.data });
    } catch (e) {
    console.log("Error in auth", e);
     } finally {
    set({ isCheckingAuth: false });
    }
    },
    signup:async(data)=>{
        set({isSigningUp:true})
        try{
            const res=await axiosInstance.post("/auth/signup",data)
            set({authUser:res.data})
            toast.success("Account created successfully")
        }
        catch(err){
            toast.error(err.response.data.message)
            console.log(err.message)
        }
        finally{
            set({isSigningUp:false})
        }
    },
    logout:async()=>{
        try{
            await axiosInstance.post("/auth/logout")
            set({authUser:null})
            toast.success("Logged out successfully")
             // Disconnect socket on logout
        }
        catch(err){
            toast.error("Something went wrong")
            console.log(err.message)
        }
    },
    login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket(); // Connect to socket after login

      
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  }

}))

export default useAuthStore