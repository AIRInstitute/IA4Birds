import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";
export const BlogCard = ({ blogData }) => (
    <>
  <div className="flex gap-4"  style={{ justifyContent:'center'}} >
    <Card className=" py-4" style={{ width:'60%', justifyContent: 'center'}}>
      <CardHeader>
        <div className="flex flex-col ">
          <p><strong>{blogData.title}</strong></p>
        </div>
      </CardHeader>
      <Divider/>
      <div className="textCardBlog flex gap-3">
        <Image
          alt="nextui logo"
          height={800}
          radius="sm"
          src={blogData.image}
          width={800}
        />
        <div className="flex flex-col">
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
          Visit source code on GitHub.
        </Link>
      </CardFooter>
    </Card>
    </div>
</>
);