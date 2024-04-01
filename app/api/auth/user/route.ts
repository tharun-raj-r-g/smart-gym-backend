import {NextRequest, NextResponse} from "next/server";
import { db } from "../../../../lib/db";
import {currentUser} from "@clerk/nextjs";
export async function GET(
    req:Request,
    {params}:{params: {userId:string, gameId:string, level:number}}
){
    console.log("route");
    try{

        
        const {searchParams} = new URL(req.url);
        const userId = searchParams.get("id");

        if (!userId) {
            return new NextResponse("User Id missing", { status: 400 });
        }
        const user = await db.user.findFirst({
           where:{
               userId
           },
        })
        if(!user){
            return new NextResponse("User not found", { status: 404 });
        }
        // console.log(user_game[0])
        return NextResponse.json(user)

    }catch (error){
        console.log("Fetching GAME", error)
        return new NextResponse("Internal Error", {status: 500});
    }
}


export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { email, gender, name, height, weight, bmi, age, injury, specification, medication, experience,userId } = await req.json();
    if (!email || !name || !gender || !height || !weight || !bmi || !age || !injury || !specification || !medication || !experience) {
      return new NextResponse("Required fields are missing", {
        status: 400,
      });
    }

    const newUser = await db.user.findFirst({
      where: {
        email,
      },
    });

    if (newUser) {
      return new NextResponse("User already exists with email: " + email, {
        status: 400,
      });
    }

    await db.user.create({
      data: {
        name,
        email,
        gender,
        height,
        weight,
        bmi,
        age,
        injury,
        specification,
        medication,
        experience,
        userId
      },
    });

    return NextResponse.json("User created");
  } catch (error) {
    console.log("Error creating user:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
