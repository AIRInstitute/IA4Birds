import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Link } from "@nextui-org/link";
import { Image } from "@nextui-org/image";
export const BlogCard = ({ blogData }) => (
  <>

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
          <Divider orientation="vertical" />

          <CardBody className="flex-col">
            <div>
              <p className="text-small text-default-500">{blogData.date}</p>
              <p><strong>{blogData.title}</strong></p>
            </div>

            <div className="flex flex-col">
              <p className="text-md">{blogData.description}</p>
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