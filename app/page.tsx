import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1> redirect to login</h1>
      <a href="/sign-in"><button className="border-black rounded-4xl border-1 p-4" >Login</button></a>
      <a href="/dashboard"><button className="border-black rounded-4xl border-1 p-4" >Dash</button></a>

    </div>
  );
}
