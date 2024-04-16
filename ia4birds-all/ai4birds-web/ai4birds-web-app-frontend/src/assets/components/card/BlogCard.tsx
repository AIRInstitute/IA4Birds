import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";
export const BlogCard = ({ blogData }) => (
    <>
  {/* <div className="flex gap-4"  style={{ justifyContent:'center'}} >
    <Card className=" py-4" style={{ width:'60%', justifyContent: 'center'}}>
      <CardHeader>
        <div className="flex flex-col ">
          <p><strong>{blogData.title}</strong></p>
        </div>
      </CardHeader>
      <Divider/> */}
  <div className="flex" style={{ justifyContent: 'center' }} >
    <Card shadow="none" className="flex-row items-center gap-2 py-1" style={{ width: '60%' }} >
      <div className="textCardBlog flex gap-3">
        <Image
          alt="nextui logo"
          height={400}
          radius="sm"
          src={blogData.image}
          width={400}
        />
        {/* <div className="flex flex-col">
          <p className="text-md">{blogData.description}</p>
          <p className="text-small text-default-500">{blogData.url}</p>
        </div>
      </div>
      <CardFooter>
        <Link
          isExternal
          showAnchorIcon
          href="https://github.com/nextui-org/nextui"
        >
          Visitar blog
        </Link>
      </CardFooter>
    </Card> */}
        <Divider orientation="vertical" />

        <CardBody className="flex-col">
          <div>
            <p className="text-small text-default-500">{blogData.date}</p>
            <p><strong>{blogData.title}</strong></p>
          </div>

          <div className="flex flex-col">
            <p className="text-md">{blogData.description}</p>
            {/* <p className="text-small text-default-500">{blogData.url}</p> */}
          </div>
          <CardFooter>
            <Link
              isExternal
              showAnchorIcon
              href={blogData.url}
            >
              Ver más información
            </Link>
          </CardFooter>
          <Divider/> 
        </CardBody>
    </div>
    </Card>

    </div>
</>
);