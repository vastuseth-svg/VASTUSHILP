import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { db } from '../../utils/supabase';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo?: string;
  order: number;
}

export function About() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [expandedBio, setExpandedBio] = useState<string | null>(null);

  useEffect(() => {
    db.getTeam()
      .then(({ data }) => {
        if (data) {
          setTeamMembers(data);
        }
      })
      .catch(err => console.error('Error loading team:', err));
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-7xl font-bold font-montserrat mb-6">
            About VASTUPURTI
          </h1>
          <p className="text-xl text-muted-foreground font-inter max-w-3xl mx-auto">
            We are a team of passionate architects and designers committed to creating
            spaces that inspire, innovate, and transform.
          </p>
        </motion.div>

        {/* Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20 backdrop-blur-md bg-card border border-border rounded-2xl p-8 md:p-12"
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <h2 className="text-4xl font-bold font-montserrat mb-6">
            Our Philosophy
          </h2>
          <div className="space-y-6 text-lg font-inter text-muted-foreground leading-relaxed">
            <p>
              At VASTUPURTI, we believe that architecture is more than just buildings—it's
              about creating experiences, shaping communities, and building dreams. Our
              approach combines timeless design principles with cutting-edge innovation
              to deliver spaces that are both beautiful and functional.
            </p>
            <p>
              Every project we undertake is a collaboration between our team and our
              clients. We listen, we understand, and we translate visions into reality.
              From initial concept to final execution, we ensure that every detail
              reflects the unique story and aspirations of those who will inhabit the
              space.
            </p>
            <p>
              Sustainability is at the core of our practice. We are committed to
              designing environmentally responsible structures that minimize ecological
              impact while maximizing comfort and efficiency. Our goal is to create
              architecture that not only serves today's needs but also preserves
              possibilities for future generations.
            </p>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat mb-4">
              Our Team
            </h2>
            <p className="text-xl text-muted-foreground font-inter">
              Meet the talented individuals behind our success
            </p>
          </div>

          {teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="backdrop-blur-md bg-card border border-border rounded-2xl overflow-hidden group cursor-pointer"
                  style={{
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                  }}
                  onClick={() => setExpandedBio(expandedBio === member.id ? null : member.id)}
                >
                  {/* Photo */}
                  {member.photo && (
                    <div className="relative h-80 overflow-hidden">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold font-montserrat mb-1 text-card-foreground">
                      {member.name}
                    </h3>
                    <p className="text-primary font-inter font-medium mb-4">
                      {member.role}
                    </p>

                    {/* Bio - Expandable */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedBio === member.id ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      <p className="text-muted-foreground font-inter leading-relaxed">
                        {member.bio}
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground font-inter mt-2">
                      {expandedBio === member.id ? 'Click to collapse' : 'Click to read bio'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-inter">
                Team information coming soon...
              </p>
            </div>
          )}
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat mb-4">
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Innovation',
                description: 'We push boundaries and embrace new technologies to create forward-thinking designs.',
              },
              {
                title: 'Integrity',
                description: 'We build trust through transparency, honesty, and unwavering commitment to quality.',
              },
              {
                title: 'Excellence',
                description: 'We strive for perfection in every detail, delivering exceptional results every time.',
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="backdrop-blur-md bg-card border border-border rounded-2xl p-8 text-center"
                style={{
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                <h3 className="text-2xl font-bold font-montserrat mb-4 text-card-foreground">
                  {value.title}
                </h3>
                <p className="text-muted-foreground font-inter leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}