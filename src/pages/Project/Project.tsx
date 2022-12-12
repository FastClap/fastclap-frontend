import React from 'react';
import './Project.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjectQuery } from '../../services/projectApi';

import { SequencesCollapse } from '../../components';

const text =
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?';

function Project() {
  const { projectId } = useParams();
  const { data, isLoading, isError } = useProjectQuery(projectId!);

  console.log(data);

  console.log(projectId);

  return (
    <div className="main-container">
      <div className="header-page-project"></div>
      <div className="columns">
        <div className="script-pages-previews"></div>
        <div className="script-container">
          <div className="script-page">
            <div className="script-text-container">
              <p>{text}</p>
            </div>
          </div>
        </div>
        <div className="collapse">
          <SequencesCollapse />
        </div>
      </div>
    </div>
  );
}

export default Project;
